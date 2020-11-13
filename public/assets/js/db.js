const dbPromised = idb.open('football-data', 1, upgradeDb => {
    let teamsObjectStore = upgradeDb.createObjectStore('teams', { keyPath: 'id' })
    teamsObjectStore.createIndex('name', 'name', { unique: false })
})


// Fungsi untuk menyimpan data
const saveTeam = team => {
    dbPromised
    .then(db => {
        let tx = db.transaction('teams', 'readwrite')
        let store = tx.objectStore('teams')
        store.put(team)
        return tx.complete
    })
    .then(() => {
        M.toast({ html: 'Berhasil Di simpan!' })
    })
}

// Mengambil semua data yang berada di indexed db
const getAll = () => {
    return new Promise((resolve, reject) => {
        dbPromised
        .then(db => {
            let tx = db.transaction('teams', 'readonly')
            let store = tx.objectStore('teams')
            return store.getAll()
        })
        .then(teams => {
            resolve(teams)
        })
    })
}

// Mengambil data dari indexed db berdasarkan id
const getById = id => {
    return new Promise((resolve, reject) => {
        dbPromised
          .then(db => {
            let tx = db.transaction("teams", "readonly");
            let store = tx.objectStore("teams");
            return store.get(id);
          })
          .then(team => {
            resolve(team);
          });
    })
}

// Menghapus data yang berada di indexed db
const deleteDataById = id => {
    return new Promise((resolve, reject) => {
        dbPromised
            .then(db => {
                let tx = db.transaction('teams', 'readwrite')
                let store = tx.objectStore('teams')
                store.delete(+id)
                return tx.complete
            })
            .then(team => {
                M.toast({ html: 'Berhasil Di hapus!' })
                resolve(team)
                window.history.back();
            })
    })
}