import database from './database.js';
import USERS_DATA from './JSONs/Users.json' assert { type: "json" };
import THEMES_DATA from './JSONs/Themes.json' assert { type: "json" };
import JOKES_DATA from './JSONs/Jokes.json' assert { type: "json" };
import Users from './Models/Users.js';
import Themes from './Models/Themes.js';
import Jokes from './Models/Jokes.js';

const { error, log } = console;

function printJokes(list = []) {
  let jokes = '';
  list.forEach((l) => {
    jokes += `- ${l.title}\n`;
  });
  return jokes;
}

async function index() {
  try {
    log('================================================================================');
    log('Iniciando ...');
    await database();

    log('================================================================================');
    log('Limpiando registros previos en la base de datos.');
    await Promise.all([
      Users.deleteMany(),
      Themes.deleteMany(),
      Jokes.deleteMany(),
    ]);

    log('================================================================================');
    log('Registrando usuarios, temas y chistes.');

    const users = USERS_DATA.map(({ name }) => new Users({ name }));
    const themes = THEMES_DATA.map(({ name }) => new Themes({ name }));
    let jokesList = [];

    users.forEach((u) => {
      const jokes = JOKES_DATA[u.name];
      themes.forEach((t) => {
        const list = jokes[t.name].map(
          (j) => new Jokes({ title: j, user: u._id, themes: [t._id] })
        );
        jokesList = [...jokesList, ...list];
      });
    });

    
    await Promise.all([
      Users.insertMany(users),
      Themes.insertMany(themes),
      Jokes.insertMany(jokesList),
    ]);

    log('================================================================================');
    log('Obteniendo chistes manolito.');
    const manolito = await Users.findOne({ name: 'Manolito' }).exec();
    
    if (manolito) {
      const jokes = await Jokes.find({ user: manolito._id }, { __v: 0, user: 0 }).exec();
      log(`Total de chistes de Manolito: ${jokes.length}.`);
      log(printJokes(jokes));
    }

    log('================================================================================');
    log('Obteniendo chistes de "Humor Negro".');
    const blackTheme = await Themes.findOne({ name: 'humor negro' }, { title: 1 }).exec();
    
    if (blackTheme) {

      const jokesBlack = await Jokes.find({ themes: blackTheme._id }, { title: 1 }).exec();

      log(`Total de chistes de "Humor negro": ${jokesBlack.length}`);
      log(printJokes(jokesBlack));
    }

    log('================================================================================');
    log('Obteniendo chistes "Humor Negro" creados por Manolito.');
    
    const jokesBlackManolito = await Jokes.find({ user: manolito._id, themes: blackTheme._id }, { title: 1 }).exec();

    log(`Total de chistes de "Humor negro" creados por Manolito: ${jokesBlackManolito.length}`);
    log(printJokes(jokesBlackManolito));
    log('================================================================================');

    log('Proceso finaliado!');
    process.exit(200);
  }
  catch (e) {
    error('Error:', e);
    process.exit(500);
  }
}

index();
