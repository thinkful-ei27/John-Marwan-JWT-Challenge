import React from 'react';
import {connect} from 'react-redux';
import requiresLogin from './requires-login';
import {fetchProtectedData} from '../actions/protected-data';
import {clearAuth} from '../actions/auth';
import LoginRefresh from './login-refresh';

export class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHidden: false
        }
    }
    componentDidMount() {
        this.props.dispatch(fetchProtectedData());
        this.startLogoutTimer();
        // this.stopLogoutTimer();
    }

    componentWillUnmount() {
        this.stopLogoutTimer();
    }

    // comment
    startLogoutTimer() {
        this.signoutTime = setInterval(
            () => this.props.dispatch(clearAuth()),
            5 * 60 * 1000 // 5 mins, interval in MS
        );
        this.warningTime = setInterval(
            () => this.setState({showHidden: true}),
            4 * 60 * 1000//* 1000 // 4 mins
        );
    }

    stopLogoutTimer() {
        if (!this.signoutTime) {
            return;
        }

        clearInterval(this.signoutTime);
        clearInterval(this.warningTime);
    }

    clickedStayLoggedIn() {
        this.stopLogoutTimer();
        this.setState({showHidden: false})
        this.startLogoutTimer();
    }

    render() {
        return (
            <div className="dashboard">
                <div className="dashboard-username">
                    Username: {this.props.username}
                </div>
                <div className="dashboard-name">Name: {this.props.name}</div>
                <div className="dashboard-protected-data">
                    Protected data: {this.props.protectedData}
                </div>
                <div className={this.state.showHidden ? '' : 'hidden'}>
                    <p>You will be logged out soon. Stay logged in?</p>
                    <button 
                        className='dashboard-stay-logged-in-submit'
                        onClick={() => this.clickedStayLoggedIn()}
                        >Yes</button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    const {currentUser} = state.auth;
    return {
        username: state.auth.currentUser.username,
        name: `${currentUser.firstName} ${currentUser.lastName}`,
        protectedData: state.protectedData.data
    };
};

export default requiresLogin()(connect(mapStateToProps)(Dashboard));
