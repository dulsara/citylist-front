import {Component} from "react";
import {RouteComponentProps} from "react-router-dom";
import {Formik, Field, Form, ErrorMessage} from "formik";
import AuthService from "../services/auth.service";

interface RouterProps {
    history: string;
}

type Props = RouteComponentProps<RouterProps>;
type State = {
    username: string,
    password: string,
    loading: boolean,
    message: string
};
export default class Login extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            username: "",
            password: "",
            loading: false,
            message: ""
        };
    }

    handleLogin(formValue: { username: string; password: string }) {
        const {username, password} = formValue;
        this.setState({
            message: "",
            loading: true
        });

        AuthService.login(username, password).then(
            () => {
                this.props.history.push("/cities");
                window.location.reload();
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();
                this.setState({
                    loading: false,
                    message: resMessage
                });
            }
        );
    }

    render() {
        const {loading, message} = this.state;
        const initialValues = {
            username: "",
            password: "",
        };
        return (
            <div className="col-md-4">

                <div>
                    <h4>Login</h4>
                    {" "}
                    <Formik
                        initialValues={initialValues}
                        // validationSchema={this.validationSchema}
                        onSubmit={this.handleLogin}
                    >
                        <Form>
                            <div className="form-group">
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className="form-control" required="required" />
                                <ErrorMessage
                                    name="username"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className="form-control" required="required" />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="alert alert-danger"
                                />
                            </div>
                            <div className="form-group">
                                <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Login</span>
                                </button>
                            </div>
                            {message && (
                                <div className="form-group">
                                    <div className="alert alert-danger" role="alert">
                                        {message}
                                    </div>
                                </div>
                            )}
                        </Form>
                    </Formik>
                </div>
            </div>
        );
    }
}