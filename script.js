// Base URL of backend on Render
const API_URL = 'https://game-list-vsip.onrender.com'

let currentGames = []

// Fetch all games
async function fetchGames() {
    try {
        const res = await fetch(`${API_URL}/games`)
        currentGames = await res.json()
        renderGames()
    } catch (err) {
        console.error("Could not fetch games:", err)
    }
}

//Render game list
function renderGames() {
    const list = document.getElementById('game-list')
    list.innerHTML = ''

    currentGames.forEach((game, idx) => {
        const li = document.createElement('li')
        if (game.checked) li.classList.add('checked')

        const checkbox = document.createElement('input')
        checkbox.type = 'checkbox'
        checkbox.checked = game.checked
        checkbox.onchange = () => toggleGame(idx, checkbox.checked)

        const label = document.createElement('label')
        label.textContent = game.name

        li.appendChild(checkbox)
        li.appendChild(label)
        list.appendChild(li)
    })
}

// --- Toggle game checked/unchecked ---
async function toggleGame(index, checked) {
    currentGames[index].checked = checked
    try {
        await fetch(`${API_URL}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ games: currentGames })
        })
    } catch (err) {
        console.error("Could not update game:", err)
    }
    renderGames()
}

// --- Add a new game ---
async function addGame() {
    const input = document.getElementById('new-game')
    const name = input.value.trim()
    if (!name) return

    // Add locally
    currentGames.push({ name, checked: false })

    // Save to backend
    try {
        await fetch(`${API_URL}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ games: currentGames })
        })
    } catch (err) {
        console.error("Could not save game:", err)
    }

    input.value = '' // clear input
    renderGames()
}