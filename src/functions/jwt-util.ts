export function getJWT() {
    let obj = localStorage.getItem('jw-token');
    if (obj != null) {
        let json = JSON.parse(obj);
        return json;
    } else {
        return '';
    }
}