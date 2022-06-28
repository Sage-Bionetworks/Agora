// -------------------------------------------------------------------------- //
// External
// -------------------------------------------------------------------------- //
import { mongo, connection } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

// -------------------------------------------------------------------------- //
// Internal
// -------------------------------------------------------------------------- //
import { setHeaders } from '../helpers';
import { cache } from '../cache';
import { Team, TeamCollection } from '../models';

// -------------------------------------------------------------------------- //
// GridFs
// -------------------------------------------------------------------------- //

let fsBucket: any;

connection.once('open', function () {
  fsBucket = new mongo.GridFSBucket(connection.db);
});

// -------------------------------------------------------------------------- //
// Teams
// -------------------------------------------------------------------------- //

export async function getTeams() {
  let teams: Team[] | undefined = cache.get('teams');

  if (teams) {
    return teams;
  }

  teams = await TeamCollection.find().lean().exec();

  cache.set('teams', teams);
  return teams;
}

export async function teamsRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const teams = await getTeams();
    setHeaders(res);
    res.json({ items: teams });
  } catch (err) {
    next(err);
  }
}

// -------------------------------------------------------------------------- //
// Team member images
// -------------------------------------------------------------------------- //

export async function getTeamMemberImage(name: string) {
  name = name.toLowerCase().replace(/[- ]/g, '_');

  let files = await fsBucket.find({ filename: name + '.jpg' }).toArray();
  if (!files.length) {
    files = await fsBucket.find({ filename: name + '.jpeg' }).toArray();
    if (!files.length) {
      files = await fsBucket.find({ filename: name + '.png' }).toArray();
    }
  }

  return files[0] || undefined;
}

export async function teamMemberImageRoute(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.params || !req.params.name) {
    res.status(404).send('Not found');
    return;
  }

  try {
    const name = req.params.name.trim();
    const file = await getTeamMemberImage(name);

    if (file?._id) {
      const stream = fsBucket.openDownloadStream(file._id);

      stream.on('data', (chunk: Buffer) => {
        res.write(chunk);
      });

      stream.on('error', () => {
        res.sendStatus(404);
      });

      stream.on('end', () => {
        res.end();
      });
    } else {
      res.end();
    }
  } catch (err) {
    next(err);
  }
}
