import React,{Component} from "react";
import CityDataService from "../services/city.service";
import {Link} from "react-router-dom";
import ICityData from '../types/city';
import Pagination from "@material-ui/lab/Pagination";


type Props = {};

type State = {
    cities: Array<ICityData>,
    currentCity: ICityData | null,
    currentIndex: number,
    searchName: string,
    page: number,
    count: number,
    pageSize: number
};

export default class CityList extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.onChangeSearchName = this.onChangeSearchName.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handlePageSizeChange = this.handlePageSizeChange.bind(this);
        this.retrieveCities = this.retrieveCities.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveCity = this.setActiveCity.bind(this);

        this.state = {
            cities: [],
            currentCity: null,
            currentIndex: -1,
            searchName: "",
            page: 1,
            count: 0,
            pageSize: 20,
        };
    }

    componentDidMount() {
        this.retrieveCities();
    }

    onChangeSearchName(e:any) {
        const searchName = e.target.value;

        this.setState({
            searchName: searchName,
        });
    }

    getRequestParams(searchName: string, page: number, pageSize: number) {
        let params = {};

        if (searchName) {
            // @ts-ignore
            params["name"] = searchName;
        }

        if (page) {
            // @ts-ignore
            params["page"] = page - 1;
        }

        if (pageSize) {
            // @ts-ignore
            params["size"] = pageSize;
        }

        return params;
    }

    retrieveCities() {
        const { searchName, page, pageSize } = this.state;
        const params = this.getRequestParams(searchName, page, pageSize);

        CityDataService.getAll(params)
            .then((response: any) => {
                const { cities, totalPages } = response.data;

                this.setState({
                    cities: cities,
                    count: totalPages,
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveCities();
        this.setState({
            currentCity: null,
            currentIndex: -1
        });
    }

    setActiveCity(city: ICityData, index: number) {
        this.setState({
            currentCity: city,
            currentIndex: index
        });
    }

    handlePageChange(event: any, value: any) {
        this.setState(
            {
                page: value,
            },
            () => {
                this.retrieveCities();
            }
        );
    }

    handlePageSizeChange(event: { target: { value: any; }; }) {
        this.setState(
            {
                pageSize: event.target.value,
                page: 1
            },
            () => {
                this.retrieveCities();
            }
        );
    }

    render() {
        const { searchName, cities, currentCity, currentIndex,page,count} = this.state;

        return (
            <div className="list row">
                <div className="col-md-8">
                </div>
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by City Name"
                        value={searchName}
                        onChange={this.onChangeSearchName}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={this.retrieveCities}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="col-md-6">

                    <h4>City List</h4>

                    <div className="mt-3">

                        <Pagination
                            className="my-3"
                            count={count}
                            page={page}
                            siblingCount={1}
                            boundaryCount={1}
                            variant="outlined"
                            shape="rounded"
                            onChange={this.handlePageChange}
                        />
                    </div>

                    <ul className="list-group">
                        {cities &&
                            cities.map((city: ICityData, index: number) => (
                                <li
                                    className={
                                        "list-group-item " +
                                        (index === currentIndex ? "active" : "")
                                    }
                                    onClick={() => this.setActiveCity(city, index)}
                                    key={index}
                                >
                                    {city.name}
                                </li>
                            ))}
                    </ul>
                </div>
                <div className="col-md-6">
                    {currentCity ? (
                        <div>
                            <h4>City Details</h4>
                            <div>
                                <label>
                                    <strong>Name:</strong>
                                </label>{" "}
                                {currentCity.name}
                            </div>
                            <div>
                                <label>
                                    <strong>Image:</strong>
                                </label>{" "}
                                <img src= {"" + currentCity.imageURL}  alt="Girl in a jacket" width="100" height="100" />

                            </div>

                            <Link
                                to={"/cities/" + currentCity.id}
                                className="badge badge-warning"
                            >
                                Edit
                            </Link>
                        </div>
                    ) : (
                        <div>
                            <br/>
                            <p>Please click on a City for more details...</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
