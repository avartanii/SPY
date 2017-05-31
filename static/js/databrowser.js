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
          title={this.props.name}
          content={"- Infos here -"}
          dismissText={"Close"}
          saveText={"Save"}
        />
      </div>
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
    // this.props.displayDetailModal(this.props);
  }

  render() {
    return (
      <tr onClick={this.handleClick}>
        <td>{this.props.index}</td>
        <td>{this.props.data.firstName}</td>
        <td>{this.props.data.lastName}</td>
      </tr>
    );
  }
}

class SearchResults extends React.Component {
  constructor() {
    super();
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
    return (
      <div>
        <table className="table table-sm table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            <SearchTableRow
              displayDetail={this.showModal}
              index={1}
              data={
                {
                  firstName: "John",
                  lastName: "Doe",
                }
              }
            />
            <SearchTableRow
              displayDetail={this.showModal}
              index={2}
              data={
                {
                  firstName: "Jane",
                  lastName: "Doe",
                }
              }
            />
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
  render() {
    return (
      <div className="displayInline">
        <select className="custom-select mr-sm-2 mb-sm-0">
          <option defaultValue>Select a Resource</option>
          <option value="1">Clients</option>
          <option value="2">Another</option>
          <option value="3">And Another</option>
        </select>
      </div>
    );
  }
}

class ColumnSelector extends React.Component {
  render() {
    return (
      <div className="displayInline">
        <select className="custom-select mr-sm-2 mb-sm-0">
          <option defaultValue>Select a Column</option>
          <option value="1">Any</option>
          <option value="2">First Name</option>
          <option value="3">Last Name</option>
          <option value="4">#</option>
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
  // This will be an "advanced" modal
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
    // this.state = {
    //   resourceSelected: false,
    //   columnSelected: false,
    // };

    console.log("A filter bar.");
  }

  // Using this syntax keeps us from needing to use bind for "this"
  // Keep in mind that we'll have to use the eslint parser babel-eslint
  // for this syntax to work, as this is ES7 exclusive at the moment.
  showModal = () => {
    $("#advancedSearch").modal("toggle");
  }

  render() {
    return (
      <div>
        <nav className="navbar sticky-top navbar-light dataBrowserFilterBar">
          <form className="form-inline">
            <ResourceSelector />
            <ColumnSelector />
            <FilterText />
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
    console.log("The whole big data browser.");
  }

  render() {
    return (
      <div className="dataBrowser">
        <FilterBar />
        <SearchResults />
      </div>
    );
  }
}

ReactDOM.render(<DataBrowser />, document.getElementById("dataBrowserContent"));
