

var Settings = React.createClass({
    render: function () {
        return (
            <div className="text">
                <h4>There is text here</h4>
            </div>
        )
    }
});

ReactDOM.render(
  <Settings />,
  document.getElementById('react-content')
);

$(function () {
    $('#options').delegate('li', 'click', function (event) {
        $('#options li').removeClass('selected');
        $(this).addClass('selected');
    });
});