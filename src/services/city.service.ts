import http from "../http-common";
import ICityData from "../types/city"

class CityDataService {
    getAll(params: {} | undefined) {
        return http.get<Array<ICityData>>("/cities",{ params });
    }

    get(id: string) {
        return http.get<ICityData>(`/cities/${id}`);
    }

    create(data: ICityData) {
        return http.put<ICityData>("/cities", data);
    }
}

export default new CityDataService();