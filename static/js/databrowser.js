/* Messing around with a data browser refactor since we're converting to Neo. */
/* eslint-disable no-console */

class ModalHeader extends React.Component {
  render() {
    return (
      <div className="modal-header">
        <h5 className="modal-title displayInline" id="exampleModalLabel">{this.props.title}</h5>
        <button type="button" className="close displayInline" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }
}

class ModalFooter extends React.Component {
  render() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">{this.props.dismissText}</button>
        <button type="button" className="btn btn-primary" style={{marginLeft: "5px"}}>{this.props.saveText}</button>
      </div>
    );
  }
}

class Modal extends React.Component {
  constructor(props) {
    super(props);
    console.log("A modal with id " + this.props.modalId);
  }

  render() {
    return (
      <div className="modal fade" id={this.props.modalId} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <ModalHeader title={this.props.title}/>
            <div className="modal-body">
              {this.props.content}
            </div>
            <ModalFooter
              dismissText={this.props.dismissText}
              saveText={this.props.saveText}
            />
          </div>
        </div>
      </div>
    );
  }
}

class DetailedInfo extends React.Component {
  constructor(props) {
    super(props);

    console.log("The modal that pops up when you click on a row containing detailed info.");
  }

  render() {
    return (
      <div>
        <Modal
          modalId={"detailedInfo"}
          title={"Detailed Information"}
          content={this.props.name}
          dismissText={"Close"}
          saveText={"Save"}
        />
      </div>
    );
  }
}

class SearchTableHeader extends React.Component {
  constructor(props) {
    super(props);

    console.log("The search table header.");
  }

  render() {
    let cells = [];
    return (
      <tr>
        <th>#</th>
        <th>First Name</th>
        <th>Last Name</th>
      </tr>
    );
  }
}

class SearchTableRow extends React.Component {
  constructor(props) {
    super(props);

    console.log("A search table row.");
  }

  handleClick = () => {
    console.log("Handling the click");
    this.props.displayDetail(this.props.data);
  }

  render() {
    let cells = [];
    for (let prop in this.props.data) {
      cells.push(<td key={prop}>{this.props.data[prop]}</td>);
    }
    return (
      <tr onClick={this.handleClick}>
        {cells}
      </tr>
    );
  }
}

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentName: "",
    };

    console.log("The search results table.");
  }

  showModal = (data) => {
    console.log(data);
    this.setState({
      currentName: data.firstName + " " + data.lastName,
    });
    $("#detailedInfo").modal("toggle");
  }

  render() {
    // let header = <SearchTableHeader />;
    let rows = [];
    for (let i = 0; i < this.props.results.length; i += 1) {
      rows.push(
        <SearchTableRow
          key={i}
          displayDetail={this.showModal}
          data={this.props.results[i]}
        />
      );
    }
    return (
      <div>
        <table className="table table-sm table-hover">
          <thead>
            <SearchTableHeader />
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        <DetailedInfo
          name={this.state.currentName}
        />
      </div>
    );
  }
}

class ResourceSelector extends React.Component {
  onResourceChange = (e) => {
    this.props.handleResourceChange(e.target.value);
  }

  render() {
    return (
      <div className="displayInline">
        <select onChange={this.onResourceChange} className="custom-select mr-sm-2 mb-sm-0">
          <option value="0" defaultValue>Select a Resource</option>
          <option value="clients">Clients</option>
          <option value="another">Another</option>
          <option value="and_another">And Another</option>
        </select>
      </div>
    );
  }
}

class ColumnSelector extends React.Component {
  onColumnChange = (e) => {
    this.props.handleColumnChange(e.target.value);
  }

  render() {
    return (
      <div className="displayInline">
        <select onChange={this.onColumnChange} className="custom-select mr-sm-2 mb-sm-0">
          <option value="0" defaultValue>Select a Column</option>
          <option value="any">Any</option>
          <option value="first_name">First Name</option>
          <option value="last_Name">Last Name</option>
          <option value="Number">#</option>
        </select>
      </div>
    );
  }
}

class FilterText extends React.Component {
  render() {
    return (
      <div className="displayInline">
        <label className="sr-only" htmlFor="inlineFormInput">Name</label>
        <input type="text" className="form-control mr-sm-2 mb-sm-0 disabled" id="inlineFormInput" placeholder="Jane Doe" />
      </div>
    );
  }
}

class QueryBuilder extends React.Component {
  render() {
    return (
      <div>
        <Modal
          modalId={"advancedSearch"}
          title={"Advanced Search"}
          content={"- Search Options here -"}
          dismissText={"Cancel"}
          saveText={"Search"}
        />
      </div>
    );
  }
}

class FilterBar extends React.Component {
  constructor() {
    super();
    this.state = {
      // A value of 0 means nothing has been selected
      resourceSelected: "0",
      columnSelected: "0",
    };

    console.log("A filter bar.");
  }

  // Using this syntax keeps us from needing to use bind for "this"
  // Keep in mind that we'll have to use the eslint parser babel-eslint
  // for this syntax to work, as this is ES7 exclusive at the moment.
  showModal = () => {
    $("#advancedSearch").modal("toggle");
  }

  handleResourceChange = (resource) => {
    this.setState({
      resourceSelected: resource,
    });

    if (this.state.columnSelected !== "0" && resource === "0") {
      this.handleColumnChange("0");
    }

    if (resource !== "0") {
      this.props.getResourceColumns();
    }
  }

  handleColumnChange = (selected) => {
    this.setState({
      columnSelected: selected,
    });
  }

  render() {
    let columnSelector = this.state.resourceSelected !== "0" ?
                            <ColumnSelector
                              handleColumnChange={this.handleColumnChange}
                            /> : null;
    let filterText = this.state.columnSelected !== "0" ? <FilterText /> : null;
    return (
      <div>
        <nav className="navbar sticky-top navbar-light dataBrowserFilterBar">
          <form className="form-inline">
            <ResourceSelector
              handleResourceChange={this.handleResourceChange}
            />
            {columnSelector}
            {filterText}
            <ul className="navbar-nav displayInline dataBrowserAdvancedButton">
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={this.showModal}>Advanced Search</a>
              </li>
            </ul>
            <QueryBuilder />
          </form>
        </nav>
      </div>
    );
  }
}

class DataBrowser extends React.Component {
  constructor() {
    super();
    this.state = {
      results: {},
    };

    console.log("The whole big data browser.");
  }

  getResourceColumns = (resource) => {
    const changeResultsState = (value) => {
      this.setState({
        results: value
      });
    };

    $.ajax({
      xhrFields: {
        withCredentials: true
      },
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
      },
      url: "api/search/clients", // "api/search/" + resource
      method: "GET",
      success: function (data) {
        console.log("Success!");
        changeResultsState(data.result.rows);
      },
      error: function (xhr) {
        console.error(xhr);

        if (xhr.status === 401) {
          localStorage.removeItem("authorization");
        }
      }
    });
  }

  render() {
    return (
      <div className="dataBrowser">
        <FilterBar
          getResourceColumns={this.getResourceColumns}
        />
        <SearchResults
          results={this.state.results}
        />
      </div>
    );
  }
}

ReactDOM.render(<DataBrowser />, document.getElementById("dataBrowserContent"));
