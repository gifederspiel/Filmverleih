import { getAll, remove, get, save, rate } from './model.js';
import { render } from './view.js';
import { render as form } from './form.js';

export async function listAction(request, response) {
  const data = await getAll(request.user.id);
  const body = render(data, request.user);
  response.send(body);
}

export async function removeAction(request, response) {
  const id = parseInt(request.params.id, 10);
  await remove(id);
  response.redirect(request.baseUrl);
}

export async function formAction(request, response) {
  let movie = { id: '', title: '', year: '', public: '' };

  if (request.params.id) {
    movie = await get(parseInt(request.params.id, 10));
  }
  const body = form(movie);
  response.send(body);
}

export async function saveAction(request, response) {
  const movie = {
    id: request.body.id,
    title: request.body.title,
    year: request.body.year,
    public: request.body.public === '1' ? 1 : 0,
  };
  await save(movie, request.user.id);
  response.redirect(request.baseUrl);
}
export async function rateAction(request, response) {
  await rate(request.user.id, request.params.id, request.params.rating);
  response.redirect(request.baseUrl);
}
