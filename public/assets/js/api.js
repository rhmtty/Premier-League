const baseUrl = "https://api.football-data.org/v2/";
const api_key = 'ffb6aa02ce764429a95c2129b4272933'
const id_league = '2021'

const standings_teams = `${baseUrl}competitions/${id_league}/standings`;
const team_info = `${baseUrl}/teams`;

// Mengambil nilai query parameter ?id=
const urlParams = new URLSearchParams(window.location.search);
const idParam = urlParams.get("id");

// Kode yang di panggil jika fetch berhasail di lakaukan
const status = response => {
    if(response.status !== 200) {
        console.log(`Error: ${response.status}`);
        return Promise.reject(new Error(response.statusText))
    } else{
        return Promise.resolve(response)
    }
}

// Parsing json menjadi array
const json = response => {
    return response.json()
}

// Handle
const error = error=> {
    console.log(`Error: ${error}`);
}

const fetchAPI = url => {
    return fetch(url, {
        headers: {
            'X-Auth-Token': api_key
        }
    })
}

// Melakukan request data json
const getStandings = () => {
    if('caches' in window) {
        caches
          .match(standings_teams)
          .then((response) => {
            if (response) {
                response.json().then((data) => {
                    // Merender data klasemen dari API
                    renderStandingsData(data)
                });
            }
          });
    }

    fetchAPI(standings_teams)
        .then(status)
        .then(json)
        .then((data) => {
            // Merender data klasemen dari API
            renderStandingsData(data)
        })
        .catch(error);
}

// Mengambil data team berdasarkan id
const getTeamById = () => {
    return new Promise((resolve, reject) => {
        if('caches' in window) {
            caches.match(`${team_info}/${idParam}`)
            .then(response => {
                if(response) {
                    response.json().then(data => {
                        // Render data team yang di ambil dari API
                        renderDetailTeam(data)
                        // Kirim objek data hasil parsing json agar bisa di simpan ke indexed db
                        resolve(data)
                    })
                }
            })
        }
    
        fetchAPI(`${team_info}/${idParam}`)
        .then(status)
        .then(json)
        .then(data => {
            // Render data team yang di ambil dari API
            renderDetailTeam(data)
            // Kirim objek data hasil parsing json agar bisa di simpan ke indexed db
            resolve(data)
        })
    })
}

// Ambil semua data yang tersimpan di indexed db
const getSavedTeams = () => {
    getAll().then(teams => {
        // Menyusun card artikel
        let teamsHTML = ''
        teams.forEach(team => {
            teamsHTML += `
                <div class="card">
                    <h2 class="header">${team.name}</h2>
                    <div class="card horizontal">
                        <div class="card-image waves-effect waves-block waves-light">
                            <a href="./detail.html?id=${team.id}&saved=true">
                                <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="logo-team">
                            </a>
                        </div>
                    <div class="card-stacked">
                        <div class="card-content">
                            <span class="card-title cyan-text text-darken-2">Address:</span><p>${team.address}</p>
                            <span class="card-title cyan-text text-darken-2">Phone:</span><p>${team.phone}</p>
                            <span class="card-title cyan-text text-darken-2">Website:</span><p>${team.website}</p>
                            <span class="card-title cyan-text text-darken-2">Email:</span><p>${team.email}</p>
                            <span class="card-title cyan-text text-darken-2">Founded:</span><p>${team.founded}</p>
                            <span class="card-title cyan-text text-darken-2">Club Colors:</span><p>${team.clubColors}</p>
                            <span class="card-title cyan-text text-darken-2">Venue:</span><p>${team.venue}</p>
                        </div>
                    </div>
                </div>`;
        })
        // Sisipkan konten
        document.querySelector('#saved-content').innerHTML = teamsHTML
    })
}


// Ambil data dari indexed db berdasarkan id
const getSavedTeamById = () => {
    getById(idParam).then(team => {
        renderDetailTeam(team)
    })
}

// Menghapus data
const deleteData = () => {
    deleteDataById(idParam).then(() => {
        let teamHTML = ''
        teamHTML += `
            <div class="col s12 m7">
                <p>Tidak ada data tersimpan</p>
            </div>`
        // Sisipkan konten
        document.querySelector("#detail-content").innerHTML = teamHTML;
    })
}

// Merender data dari fetch API
const renderDetailTeam = (team) => {
    let teamHTML = ''
    teamHTML += 
        `<div class="col s12 m7">
            <h2 class="header">${team.name}</h2>
            <div class="card horizontal">
                <div class="card-image">
                    <img src="${team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="logo-team">
                </div>
            <div class="card-stacked">
                <div class="card-content">
                    <span class="card-title cyan-text text-darken-2">Address:</span><p>${team.address}</p>
                    <span class="card-title cyan-text text-darken-2">Phone:</span><p>${team.phone}</p>
                    <span class="card-title cyan-text text-darken-2">Website:</span><p>${team.website}</p>
                    <span class="card-title cyan-text text-darken-2">Email:</span><p>${team.email}</p>
                    <span class="card-title cyan-text text-darken-2">Founded:</span><p>${team.founded}</p>
                    <span class="card-title cyan-text text-darken-2">Club Colors:</span><p>${team.clubColors}</p>
                    <span class="card-title cyan-text text-darken-2">Venue:</span><p>${team.venue}</p>
                </div>
            </div>
        </div>`;
    // Sisipkan konten
    document.querySelector("#detail-content").innerHTML = teamHTML;
}

const renderStandingsData = (result) => {
    let contentsHTML = ''
    result.standings.forEach((standing) => {
        standing.table.forEach((result) => {
            contentsHTML += `
                <tr>
                    <td>${result.position}</td>
                    <td>
                        <img class="logo-team" src="${result.team.crestUrl.replace(/^http:\/\//i, 'https://')}" alt="logo-team">
                        ${result.team.name}
                    </td>
                    <td>${result.playedGames}</td>
                    <td>${result.won}</td>
                    <td>${result.draw}</td>
                    <td>${result.lost}</td>
                    <td>${result.points}</td>
                    <td><a href="./detail.html?id=${result.team.id}">Lihat Tim</a></td>
                </tr>`;
        });
    });
    // Sisipkan komponen
    document.querySelector(".data").innerHTML = contentsHTML;
}