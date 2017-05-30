/* Messing around with a data browser refactor since we're converting to Neo. */
/* eslint-disable no-console */

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
      </div>
    );
  }
}

class FilterBar extends React.Component {
  constructor() {
    super();
    console.log("A filter bar.");
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-light dataBrowserFilterBar">
          <form className="form-inline">
            <ResourceSelector />
            <ColumnSelector />
            <FilterText />
          </form>
        </nav>
      </div>
    );
  }
}

class SearchResults extends React.Component {
  constructor() {
    super();
    console.log("The search results table.");
  }

  render() {
    return (
      <table className="table table-sm table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John</td>
            <td>Doe</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane</td>
            <td>Doe</td>
          </tr>
        </tbody>
      </table>
    );
  }
}

class DetailedInfo extends React.Component {
  constructor() {
    super();
    console.log("The modal that pops up when you click on a row containing detailed info.");
  }

  render() {
    return (
      <div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Name Here</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              - Infos here -
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class DataBrowser extends React.Component {
  constructor() {
    super();
    console.log("The whole big data browser.");
  }

  // Using this syntax keeps us from needing to use bind for "this"
  // Keep in mind that we'll have to use the eslint parser babel-eslint
  // for this syntax to work, as this is ES7 exclusive at the moment.
  showModal = () => {
    $("#myModal").modal("toggle");
  }

  render() {
    return (
      <div className="dataBrowser">
        <FilterBar />
        <SearchResults />
        <DetailedInfo />
        <button type="button" onClick={this.showModal} className="btn btn-primary">
          Launch demo modal
        </button>
      </div>
    );
  }
}

ReactDOM.render(<DataBrowser />, document.getElementById("dataBrowserContent"));
