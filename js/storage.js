export const storage = {
    saveFavoriteCities(favoriteCities) {
        localStorage.setItem("cities", favoriteCities);
    },
    saveCurrentCity(currentCity) {
        localStorage.setItem("currentCity", currentCity);
        
    },
    getFavoriteCities() {
        return localStorage.getItem("cities");
    },
    getCurrentCity() {
        return localStorage.getItem("currentCity");
    }
}