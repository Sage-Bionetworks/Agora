import { TeamInfo } from '../models';

export const mockTeam1: TeamInfo = {
    team: 'Duke',
    description: 'The Duke team, led by Rima Kaddurah-Daouk, focuses on taking an ' +
        'integrated metabolomics-genetics-imaging systems approach to define network ' +
        'failures in Alzheimer\'s disease.',
    members: [
        {
            name: 'Andrew Saykin',
            isprimaryinvestigator: false
        },
        {
            name: 'Colette Blach',
            isprimaryinvestigator: false
        },
        {
            name: 'Rima Kaddurah-Daouk',
            isprimaryinvestigator: true,
            url: 'https://psychiatry.duke.edu/kaddurah-daouk-rima-fathi'
        }
    ]
};

export const mockTeam2: TeamInfo = {
    team: 'Harvard-MIT',
    description: 'The Harvard-MIT team, lead by Bruce Yankner and Li-Huei Tsai, focuses ' +
        'on elucidating the regulatory role of the REST network in protecting aging neurons ' +
        'from age-related stressors, reducing neuroinflammation and preserving cognitive ' +
        'function.',
    members: [
        {
            name: 'Bruce Yankner',
            isprimaryinvestigator: true,
            url: 'http://www.hms.harvard.edu/dms/neuroscience/fac/yankner.php'
        },
        {
            name: 'Li-Hue Tsai',
            isprimaryinvestigator: true,
            url: 'http://tsailaboratory.mit.edu/li-huei-tsai/'
        }
    ]
};
