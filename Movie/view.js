export function render(movies, user) {
    return `
  <!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <title>Filmliste</title>
    <link rel="stylesheet" href="style.css" />
  </head>
  <body>
  Angemeldet als: ${user.firstname} ${
      user.lastname
    } &nbsp;&nbsp;<a href="/logout">abmelden</a>
    <table>
      <thead><tr><th>Id</th><th>Title</th><th></th><th></th></tr></thead>
      <tbody>
        ${movies
          .map(
            (movie) => `
          <tr>
            <td>${movie.id}</td>
            <td>${movie.title}</td>
            <td>
              <div class="rating">
                <a href="/movie/rate/${movie.id}/1" class="star">${movie.userRating >= 1 ? '&#9733;' : '&#9734;'}</a>
                <a href="/movie/rate/${movie.id}/2" class="star">${movie.userRating >= 2 ? '&#9733;' : '&#9734;'}</a>
                <a href="/movie/rate/${movie.id}/3" class="star">${movie.userRating >= 3 ? '&#9733;' : '&#9734;'}</a>
                <a href="/movie/rate/${movie.id}/4" class="star">${movie.userRating >= 4 ? '&#9733;' : '&#9734;'}</a>
                <a href="/movie/rate/${movie.id}/5" class="star">${movie.userRating == 5 ? '&#9733;' : '&#9734;'}</a>
              </div>
            </td>
            <td>(${movie.averageRating})</td>
            <td><a href="/movie/delete/${movie.id}">löschen</a></td>
            <td><a href="/movie/form/${movie.id}">bearbeiten</a></td> 
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <a href="/movie/form">neu</a>
  </body>
  </html>
    `;
  }
  