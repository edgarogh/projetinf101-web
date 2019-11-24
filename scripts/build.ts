import { execSync } from 'child_process';
import FS from 'fs';
import Path from 'path';
import { sync as rimraf } from 'rimraf';

const WD = Path.join(__dirname, '../.tmp');

rimraf(WD);

FS.mkdirSync(WD);
execSync('git clone https://github.com/matteodcr/projetinf101.git', {
    cwd: WD,
});

const REPO_DIR = Path.join(WD, 'projetinf101');

const commitName = execSync('git rev-parse HEAD', {
    cwd: REPO_DIR,
    encoding: 'utf8',
}).trim();

FS.writeFileSync(Path.join(REPO_DIR, 'turtle.py'), '');

FS.writeFileSync(Path.join(REPO_DIR, 'turtle_utils.py'), `
__pragma__('kwargs')

def rect(x, y, width, height, color = None, fill_color = None):
    native_rect(x, y, width, height, color, fill_color)

__pragma__('nokwargs')
`);

execSync('transcrypt -b main.py', {
    cwd: REPO_DIR,
});

const GEN_DIR = Path.join(__dirname, '../src/gen');

try {
    rimraf(GEN_DIR);
} catch (e) {}

FS.renameSync(Path.join(REPO_DIR, '__target__'), GEN_DIR);

// Make some functions async to be able to handle blocking user input
const PC_PATH = Path.join(GEN_DIR, 'partieC.js');
FS.writeFileSync(PC_PATH, FS.readFileSync(PC_PATH, 'utf8')
    .replace('boucle_jeu=function', 'boucle_jeu=async function')
    .replace('jouer_un_coup=function', 'jouer_un_coup=async function')
    .replace('lire_coords=function', 'lire_coords=async function')
    .replace(/= ?jouer_un_coup/g, '=await jouer_un_coup')
    .replace(/= ?lire_coords/g, '=await native_lire_coords')
);

rimraf(WD);
