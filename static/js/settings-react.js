class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabStates: [true, false, false, false, false]
    };
    this.tabNames = ["Account",
                    "Notifications",
                    "Client Profiles",
                    "Create New Activity",
                    "Import Data"];

    // as of ES6 and React 15.5.0, we have to explicitly bind "this" in the constructor
    // so that handler functions have access to it, otherwise "this" is undefined
    // ES6 doesn't bind "this" automatically
    this.exampleHandler = this.exampleHandler.bind(this);
    this.tabs = this.tabs.bind(this);
    this.selectTab = this.selectTab.bind(this);
    this.tabContent = this.tabContent.bind(this);
  }

  exampleHandler() {
    // code
  }

  selectTab(event) {
    let tabStates = this.state.tabStates;
    tabStates.forEach((state, index, thisArray) => {
      if (index === parseInt(event.target.getAttribute('data-index'))) {
        thisArray[index] = true;
      } else {
        thisArray[index] = false;
      }
    });
    this.setState({
      tabStates: tabStates
    });
  }

  tabs() {
    let tabs = this.tabNames.map((tabName, index) => {
      return [tabName, this.state.tabStates[index]];
    });
    tabs.forEach((tabName, index, thisArray) => {
      if (tabName[1]) {
        thisArray[index] = <li className="selected">
                    <a data-index={index} onClick={this.selectTab} >
                      {tabName[0]}
                    </a>
                  </li>;
      } else {
        thisArray[index] = <li>
                    <a data-index={index} onClick={this.selectTab}>
                      {tabName[0]}
                    </a>
                  </li>;
      }
    });
    return tabs;
  }

  tabContent() {
    let contents = [
      <AccountSettings />,
      <NotificationSettings />,
      <ClientProfileSettings />,
      <NewActivitySettings />,
      <ImportDataSettings />
    ];

    let content = {};
    this.state.tabStates.forEach((state, index) => {
      if (state) {
        content = contents[index];
      }
    });

    return content;
  }

  render() {
    return ( // render can only return a single div
      <div className="row pt-1">
        <div id="navigation" className="col-sm-3 col-lg-2">
          <nav className="side-nav">
            <ul id="options">
              {this.tabs()}
            </ul>
          </nav>
        </div>
        <div className="col-sm-9 col-lg-10">
          <div className="row">
            {this.tabContent()}
          </div>
        </div>
      </div>
    );
  }
}

class AccountSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    // if a particular state is controlled by parent Component
    // bypass this component's state and send the lifted state
    // directly to this.props
  }

  // anything in brackets is a JavaScript expression
  render() {
    return (
      <div id="account-settings">
        <div className="card">
          <div className="card-header">
            <h4>
              Change Password
            </h4>
          </div>
          <form>
            <PasswordInput inputTitle={"Current Password"} />
            <PasswordInput inputTitle={"New Password"} />
            <PasswordInput inputTitle={"Confirm New Password"} />
            <p>
              <button id="update-button" className="btn btn-outline-primary">Update Password</button>
              <span><a href="#">I forgot my password</a></span>
            </p>
            <p id="status"></p>
          </form>
        </div>
      </div>

    );
  }
}

class PasswordInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <dl>
        <dt>{this.props.inputTitle}</dt>
        <dd><input type="password" className="form-control" /></dd>
      </dl>
    );
  }
}

class NotificationSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      settingsStates: {}
    };

    this.notificationTypes = JSON.parse(window.sessionStorage.notificationTypes);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.makeRows = this.makeRows.bind(this);
  }

  componentDidMount() {
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
      },
      url: "/api/users/1/settings",
      method: "GET"
    }).done(function (data) {
      this.setState({
        loading: false,
        settingsStates: data.result[0].settingsData
      });
    }.bind(this)).fail(function (xhr) {
  // ^^^^^^^^^^^ for ajax need to bind React's "this" to the callbacks
      console.error(xhr);
      if (xhr.status === 401) {
        localStorage.removeItem("authorization");
      }
    });
  }

  makeRows() {
    let rows = [];
    let states = this.state.settingsStates;
    this.notificationTypes.forEach(function (type) {
      if (states[type.name]) {
        rows.push(<tr>
                  <td>{type.name}</td>
                  <td><input data-name={type.name} type="checkbox" name="settings-checkbox" checked /></td>
                </tr>);
      } else {
        rows.push(<tr>
                    <td>{type.name}</td>
                    <td><input data-name={type.name} type="checkbox" name="settings-checkbox" /></td>
                  </tr>);
      }
    });
    return rows;
  }

  render() {
    let rows = <tr>Loading . . .</tr>;
    if (this.state.settingsStates) {
      rows = this.makeRows();
    }
    return (
      <div id="notifications-settings">
        <div id="flag-notifications">
          <div className="card">
            <div className="card-header">
              <h4>
                Flag Notifications
              </h4>
              <p>Determine which flags you would like to receive alerts for.</p>
            </div>
            <table className="table table-hover" id="flag-notifications-table">
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

class ClientProfileSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };

    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount() {
    let globalData = [];
    globalData.push(JSON.parse(window.sessionStorage.flagTypes));

    let loadGlobalData = function () {
      this.setState({
        loading: false
      });
      this.flagTypes = JSON.parse(window.sessionStorage.flagTypes);
    }.bind(this);
    console.log(globalData);
    if (globalData.every((array) => array)) {
        console.log("call arrived");
        loadGlobalData();
    } else {
        console.log("waiting for call");
        window.sessionStorageListeners.push({
            ready: loadGlobalData
        });
    }

  }

  render() {
    let rows = <tr>Loading . . .</tr>;
    if (!this.state.loading) {
      rows = this.flagTypes.map((flagType) => <FlagTableRow flagType={flagType} />);
    }
    return (
      <div id="client-profile-settings">
        <div className="card">
          <div className="card-header">
            <h4>
              Flags <button type="button" className="btn btn-success" data-toggle="modal" style={{float: 'right'}} data-target="#new-flag-modal">Add Flag <i className="fa fa-plus" aria-hidden="true"></i></button>
            </h4>
            <p>Create standard flag types along with their default messages and notes that staff can use to assign to client profiles.</p>
          </div>
          <table className="table table-hover" id="flags-table">
            <thead>
              <tr>
                <th>Flag Color</th>
                <th>Flag Type</th>
                <th>Flag Message</th>
                <th>Flag Note</th>
                <th>Settings</th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

class FlagTableRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false
    };

    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
  }

  componentDidUpdate() {
    if (this.state.editMode) {
      $('#edit-color').spectrum({
              color: $('#edit-color').parent().data('color'),
              change: function(color) {
                  $('#edit-color').parent().data("newcolor", color.toHexString());
              }
          });
    }
  }

  handleEditClick(event) {
    this.setState({
      editMode: true
    });
  }

  render() {
    let flagType = this.props.flagType;
    let message = flagType.settings.defaults.message;
    let note = flagType.settings.defaults.note;
    if (this.state.editMode) {
      return (
        <tr data-id={flagType.id}>
          <td className="color-column col" data-color={flagType.color} data-newcolor=""><input type="text" id="edit-color"/></td>
          <td className="type-column col" data-type={flagType.name}>{flagType.name}</td>
          <td className="message-column col" data-message={message}>{message}</td>
          <td className="note-column col" data-note={note}>{note}</td>
          <td>
          <button id="submit-flag" type="button" className="btn btn-primary btn-sm">Submit</button>
          <button id="cancel-flag" type="button" className="btn btn-primary btn-sm">Cancel</button>
          </td>
        </tr>
      );
    } else {
      let buttonStyle = {
        backgroundImage: 'none',
        backgroundColor: flagType.color
      };
      return (
        <tr data-id={flagType.id}>
          <td className="color-column col" data-color={flagType.color} data-newcolor=""><button type="button" className="btn btn-primary flagType" style={buttonStyle}><span className="badge"></span></button></td>
          <td className="type-column col" data-type={flagType.name}>{flagType.name}</td>
          <td className="message-column col" data-message={message}>{message}</td>
          <td className="note-column col" data-note={note}>{note}</td>
          <td><button type="button" className="btn btn-secondary edit" onClick={this.handleEditClick}>Edit</button></td>
        </tr>
      );
    }
  }
}

class NewActivitySettings extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}

class ImportDataSettings extends React.Component {
  render() {
    return (
      <div></div>
    );
  }
}


ReactDOM.render(
  <Settings />,
  document.getElementById('settings-content')
);
