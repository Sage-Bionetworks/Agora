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
