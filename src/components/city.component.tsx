import React, {Component, ChangeEvent} from "react";
import {Link, RouteComponentProps} from 'react-router-dom';

import CityDataService from "../services/city.service";
import ICityData from "../types/city";

interface RouterProps { // type for `match.params`
    id: string; // must be type `string` since value comes from the URL
}

type Props = RouteComponentProps<RouterProps>;

type State = ICityData &{
    submitted: boolean
    message: string;
}

export default class City extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.getCity = this.getCity.bind(this);
        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeImageURL = this.onChangeImageURL.bind(this);
        this.editCity = this.editCity.bind(this);

        // @ts-ignore
        this.state = {

            id: this.props.match.params.id,
            name: "",
            imageURL: "",
            message: "",
            submitted: true,
        };
    }

    onChangeName(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            name: e.target.value
        });
    }

    onChangeImageURL(e: ChangeEvent<HTMLInputElement>) {
        this.setState({
            imageURL: e.target.value
        });
    }

    editCity() {
        const data: ICityData = {
            name: this.state.name,
            imageURL:this.state.imageURL,
            id: this.state.id
        };

        CityDataService.update(data)
            .then((response: any) => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    imageURL: response.data.imageURL,
                    submitted: false
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                this.setState({
                    message:e.message
                });
                console.log(e);
            });
    }

    componentDidMount() {
        this.getCity(this.props.match.params.id);
    }

    getCity(id: string) {
        CityDataService.get(id)
            .then((response: any) => {
                this.setState({
                    id: response.data.id,
                    name: response.data.name,
                    imageURL: response.data.imageURL,
                    submitted: true
                });
                console.log(response.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }


    render() {
        const {name,imageURL,submitted} = this.state;

        return (
            <div>
                {submitted ? (
                    <div className="edit-form">
                        <h4>City Edit</h4>
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name : </label>
                                {" "}
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    required
                                    value={name}
                                    onChange={this.onChangeName}
                                    name="name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="iurl">Image URL : </label>
                                {" "}
                                <input
                                    type="textarea"
                                    className="form-control"
                                    id="iurl"
                                    required
                                    value={imageURL}
                                    onChange={this.onChangeImageURL}
                                    name="iurl"
                                />
                            </div>
                        </form>

                        <button
                            type="submit"
                            className="badge badge-success"
                            onClick={this.editCity}
                        >
                            UPDATE
                        </button>
                        <p>{this.state.message}</p>
                    </div>
                ) : (
                    <div>
                        <br/>
                        <p>Successfully Saved. Please click on a City List...</p>
                        <Link
                            to={"/cities"}
                            className="badge badge-warning"
                        >
                            City-List
                        </Link>
                    </div>
                )}
            </div>
        );
    }
}
