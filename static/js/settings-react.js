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

  selectTab(event) { // event is React's SyntheticEvent wrapper, event.nativeEvent is the original js event object
    let tabStates = this.state.tabStates;
    tabStates.forEach((state, index, thisArray) => {
      if (index === parseInt($(event.target).parents('li').data('index'))) {
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
        thisArray[index] = <li data-index={index} onClick={this.selectTab} className="selected">
                    <a>
                      {tabName[0]}
                    </a>
                  </li>;
      } else {
        thisArray[index] = <li data-index={index} onClick={this.selectTab}>
                    <a>
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
      loading: true,
      rowStates: [],
      colorValue: "",
      typeValue: "",
      messageValue: "",
      noteValue: ""
    };

    this.loadFlagTypes = this.loadFlagTypes.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.handleColorChange = this.handleColorChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleMessageChange = this.handleMessageChange.bind(this);
    this.handleNoteChange = this.handleNoteChange.bind(this);
  }

  loadFlagTypes() {
    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
      },
      url: "api/flags/types",
      method: "GET"
    }).done(function (data) {
      console.log(data);
      this.flagTypes = data.result;
      this.setState({
        loading: false,
        rowStates: Array(this.flagTypes.length).fill(false)
      });
    }.bind(this)).fail(function (xhr) {
      console.error(xhr);
      if (xhr.status === 401) {
          localStorage.removeItem("authorization");
      }
    });
  }

  componentDidMount() {
    this.loadFlagTypes();
  }

  handleSubmitClick(event) {
    let newColor = this.state.colorValue;
    let data = {
      color: newColor ? newColor : $(event.target).parents('tr').find('.color-column').data("color"),
      typeName: this.state.typeValue,
      message: this.state.messageValue,
      note: this.state.noteValue
    };
    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
        },
        url: 'api/flags/types/' + $(event.target).parents('tr').data("id"),
        method: 'PUT',
        data: data
    }).done(function (data) {
        console.log(data);
        this.loadFlagTypes();
        var color = data.result[0].color;

        var columns = $(event.target).parent().siblings();
        var colorcol = $(columns).parent().find('.color-column');

        $(event.target).parents('tr').data("id", data.result[0].id);
        $(colorcol).data("color", color);
      }.bind(this)).fail(function (xhr) {
        console.error(xhr);
        if (xhr.status === 401) {
          localStorage.removeItem("authorization");
        }
      });
    this.handleCancelClick();
  }

  handleEditClick(event, flagType) {
    let rowStates = this.state.rowStates;
    rowStates.fill(false);
    rowStates[parseInt($(event.target).parents('tr').data('index'))] = true;
    this.setState({
      rowStates: rowStates,
      colorValue: flagType.color,
      typeValue: flagType.name,
      messageValue: flagType.settings.defaults.message,
      noteValue: flagType.settings.defaults.note
    });
  }

  handleCancelClick(event) {
    let rowStates = this.state.rowStates;
    rowStates.fill(false);
    this.setState({
      rowStates: rowStates,
      colorValue: "",
      typeValue: "",
      messageValue: "",
      noteValue: ""
    });
  }

  handleColorChange(color) {
    this.setState({
      colorValue: color
    });
  }

  handleTypeChange(event) {
    this.setState({
      typeValue: event.target.value
    });
  }

  handleMessageChange(event) {
    this.setState({
      messageValue: event.target.value
    });
  }

  handleNoteChange(event) {
    this.setState({
      noteValue: event.target.value
    });
  }

  render() {
    let rows = <tr>Loading . . .</tr>;
    if (!this.state.loading) {
      rows = this.flagTypes.map((flagType, index) => <FlagTableRow flagType={flagType}
                                                                   index={index}
                                                                   editMode={this.state.rowStates[index]}
                                                                   editClick={this.handleEditClick}
                                                                   submitClick={this.handleSubmitClick}
                                                                   cancelClick={this.handleCancelClick}
                                                                   colorValue={this.state.colorValue}
                                                                   typeValue={this.state.typeValue}
                                                                   messageValue={this.state.messageValue}
                                                                   noteValue={this.state.noteValue}
                                                                   colorChange={this.handleColorChange}
                                                                   typeChange={this.handleTypeChange}
                                                                   messageChange={this.handleMessageChange}
                                                                   noteChange={this.handleNoteChange} />);
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

    this.componentWillUpdate = this.componentWillUpdate.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  componentWillUpdate() {
    if (!this.props.editMode) {
      $('.sp-replacer').remove(); // removing spectrum manually
    }
  }

  componentDidUpdate() {
    if (this.props.editMode) {
      console.log($('#edit-color').parent().data('color'));
      console.log(this.props.colorValue);
      $('#edit-color').spectrum({
              color: this.props.colorValue ? this.props.colorValue : $('#edit-color').parent().data('color'),
              change: function (color) {
                  this.props.colorChange(color.toHexString());
              }.bind(this)
          }).bind(this);
      // once rendered, spectrum is untracked by React
      // so will have to manually remove it from the DOM later

      // componentDidUpdate also gets called many times for each state change
      // so it is likely that multiple color pickers are added
    }
  }

  /*
     Note:
      Arrow functions allow passing an argument to a handler callback
      <button onClick={(event) => this.props.editClick(event, flagType)}></button>
  */

  render() {
    let flagType = this.props.flagType;
    let name = flagType.name;
    let message = flagType.settings.defaults.message;
    let note = flagType.settings.defaults.note;
    let typeValue = this.props.typeValue ? this.props.typeValue : name;
    let messageValue = this.props.messageValue ? this.props.messageValue : message;
    let noteValue = this.props.noteValue ? this.props.noteValue : note;

    if (this.props.editMode) {
      return (
        <tr data-id={flagType.id} data-index={this.props.index}>
          <td className="color-column col" data-color={flagType.color}><input type="text" id="edit-color"/></td>
          <td className="type-column col"><input type="text" id="edit-type" value={typeValue} onChange={this.props.typeChange}/></td>
          <td className="message-column col"><input type="text" id="edit-message" value={messageValue} onChange={this.props.messageChange}/></td>
          <td className="note-column col"><input type="text" id="edit-note" size="45" value={noteValue} onChange={this.props.noteChange}/></td>
          <td>
          <button id="submit-flag" type="button" className="btn btn-primary btn-sm" onClick={this.props.submitClick}>Submit</button>
          <button id="cancel-flag" type="button" className="btn btn-primary btn-sm" onClick={this.props.cancelClick}>Cancel</button>
          </td>
        </tr>
      );
    } else {
      let buttonStyle = {
        backgroundImage: 'none',
        backgroundColor: flagType.color
      };
      return (
        <tr data-id={flagType.id} data-index={this.props.index}>
          <td className="color-column col"><button type="button" className="btn btn-primary flagType" style={buttonStyle}><span className="badge"></span></button></td>
          <td className="type-column col">{flagType.name}</td>
          <td className="message-column col">{message}</td>
          <td className="note-column col">{note}</td>
          <td><button type="button" className="btn btn-secondary edit" onClick={(event) => this.props.editClick(event, flagType)}>Edit</button></td>
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
