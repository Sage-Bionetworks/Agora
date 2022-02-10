import { TeamInfo } from '../models';

export const mockTeam1: TeamInfo = {
    team: 'Duke',
    team_full: 'Duke University',
    program: 'AMP-AD',
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
    team_full: 'Harvard University - Massachusetts Institute of Technology',
    program: 'AMP-AD',
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

// Reordered team info for the Duke university
export const mockTeam3: TeamInfo = {
    team: 'Duke',
    team_full: 'Duke University',
    program: 'AMP-AD',
    description: 'The Duke team, led by Rima Kaddurah-Daouk, focuses on taking an ' +
        'integrated metabolomics-genetics-imaging systems approach to define network ' +
        'failures in Alzheimer\'s disease.',
    members: [
        {
            name: 'Rima Kaddurah-Daouk',
            isprimaryinvestigator: true,
            url: 'https://psychiatry.duke.edu/kaddurah-daouk-rima-fathi'
        },
        {
            name: 'Andrew Saykin',
            isprimaryinvestigator: false
        },
        {
            name: 'Colette Blach',
            isprimaryinvestigator: false
        }
    ]
};

export const mockTeam4: TeamInfo = {
    team: 'Columbia-Rush',
    team_full: 'Columbia University - Rush University',
    program: 'AMP-AD',
    description: 'The Columbia-Rush AMP-AD team, led by Philip De Jager and David Bennett, focuses on taking a ' +
        'systems biology approach to mine a unique set of deep clinical, paraclinical, pathologic, genomic, ' +
        'epigenomic, transcriptomic, proteomic, metabolic and single cell brain and blood data from more than 1000 ' +
        'subjects from two prospective cohort studies of aging and dementia. They use these data to identify genes, ' +
        'proteins, and pathways with critical roles in a range of traits that influence the function of the aging ' +
        'brain, including susceptibility Alzheimer\'s disease, the accumulation of aging-related neuropathologies, ' +
        'cognitive decline in older age, as well as resilience to the brain pathologies. Finally, the team then ' +
        'interrogates those genes in ex vivo and in vitro systems to determine their therapeutic potential.',
    members: [
        {
            name: 'Chris Gaiteri',
            isprimaryinvestigator: false
        },
        {
            name: 'David Bennett',
            isprimaryinvestigator: true,
            url: 'https://www.rushu.rush.edu/faculty/david-bennett-md'
        },
        {
            name: 'Jishu Xu',
            isprimaryinvestigator: false
        },
        {
            name: 'Lei Yu',
            isprimaryinvestigator: false
        },
        {
            name: 'Philip De Jager',
            isprimaryinvestigator: true,
            url: 'http://www.cumc.columbia.edu/dept/taub/faculty-dejager.html'
        },
        {
            name: 'Shinya Tasaki',
            isprimaryinvestigator: false
        },
        {
            name: 'Tracy Young Pearce',
            isprimaryinvestigator: false
        }
    ]
};
