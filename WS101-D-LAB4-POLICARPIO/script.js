let playlist = [
    { title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock", duration: 354 },
    { title: "Shape of You", artist: "Ed Sheeran", genre: "Pop", duration: 233 },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", genre: "Grunge", duration: 301 },
    { title: "Blinding Lights", artist: "The Weeknd", genre: "Pop", duration: 200 },
    { title: "Hotel California", artist: "Eagles", genre: "Rock", duration: 390 }
];

function calculateTotalDuration(songs) {
    const totalDuration = songs.reduce((total, song) => total + song.duration, 0);
    return totalDuration;
}

function formatDuration(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
}

function filterSongsByGenre(songs, genre) {
    const targetGenre = genre.toLowerCase();
    return songs.filter(song => song.genre.toLowerCase() === targetGenre);
}

function findLongestSong(songs) {
    if (songs.length === 0) {
        return null;
    }
    const longestSong = songs.reduce((longest, current) => {
        return current.duration > longest.duration ? current : longest;
    }, songs[0]);

    return longestSong;
}

function groupSongsByArtist(songs) {
    return songs.reduce((grouped, song) => {
        const artist = song.artist;
        
        if (!grouped[artist]) {
            grouped[artist] = [];
        }
        
        grouped[artist].push(song);
        
        return grouped;
    }, {});
}

function fetchNewSongsAsync(songs) {
    console.log("-> Simulating asynchronous fetching of new songs...");
    
    return new Promise((resolve) => {
        setTimeout(() => {
            const newSongs = [
                { title: "Levitating", artist: "Dua Lipa", genre: "Pop", duration: 203 },
                { title: "Come Together", artist: "The Beatles", genre: "Rock", duration: 259 }
            ];
            
            songs.push(...newSongs); 

            console.log("-> New songs fetched and added successfully.");
            resolve(newSongs.length);
        }, 2000);
    });
}

console.log("--- Initial Playlist State ---");
console.log(playlist);
console.log("Total songs:", playlist.length);
console.log("---");

const totalSecs = calculateTotalDuration(playlist);
console.log(`Total Playlist Duration: ${totalSecs} seconds (${formatDuration(totalSecs)})`);
console.log("---");

const rockSongs = filterSongsByGenre(playlist, "Rock");
console.log("Songs in the 'Rock' genre:", rockSongs);
console.log("---");

const longestTrack = findLongestSong(playlist);
console.log(`Longest Song: "${longestTrack.title}" by ${longestTrack.artist} (${longestTrack.duration}s)`);
console.log("---");

const groupedByArtist = groupSongsByArtist(playlist);
console.log("Songs Grouped by Artist:");
console.log(groupedByArtist);
console.log("---");

async function updatePlaylist() {
    try {
        const addedCount = await fetchNewSongsAsync(playlist);
        console.log(`${addedCount} songs were added to the playlist.`);
        console.log("--- Updated Playlist State ---");
        console.log(playlist);
        console.log("Total songs now:", playlist.length);
        
        const newTotalSecs = calculateTotalDuration(playlist);
        console.log(`ssNew Total Playlist Duration: ${formatDuration(newTotalSecs)}`);

    } catch (error) {
        console.error("An error occurred during async fetch:", error);
    }
}

updatePlaylist();