$(function (event) {


    $.ajax({
        xhrFields: {
            withCredentials: true
        },
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', localStorage.getItem("authorization"));
        },
        url: "/api/clients/" + 1 + "/forms",
        method: "GET",
        success: function (data) {
            console.log(data);
        },
        error: function (xhr) {
            console.error(xhr);

            if (xhr.status === 401) {
                localStorage.removeItem("authorization");
            }
        }
    });
    /*
        TODO:
        - text boxes for 'Other' and 'More than' options

        - once database tables are set up, use ajax
        to retrieve options and labels for checkboxes
        (rather than the hard-coded arrays)
    */

    // provide identifier with '#'
    var buildListItems = function (array, identifier, classname) {
        array.forEach(function (element) {
            $(identifier).append(
                '<li><label><input type="checkbox" class="' + classname + '">' +
                element + '</input></label></li>'
            );
        });
    };

    var buildOptions = function (array, identifier) {
        array.forEach(function (element, index) {
            $(identifier).append(
                '<option value="' + index + '">' + element + '</option>'
            );
        });
    };

    var sleepingLocations = [
        'Venice Boardwalk',
        'Street/alley/park',
        'Abandoned Building',
        'Detox/Rehab Center',
        'Transitional Housing',
        'Emergency Shelter',
        'Jail/juvenile detention',
        'Halfway House',
        'Family Members Home',
        'Permanent Supportive Housing',
        'Foster Care Home',
        'Long-term care facility',
        'Safe haven',
        'Friend\'s home',
        'Hospital - Medical',
        'Hospital - Psychiatric',
        'Hotel/motel',
        'Car'
    ];

    buildListItems(sleepingLocations, '#housing-history-checkboxes', 'housing-history-checkbox');

    var sleepingDurations = [
        '1 day',
        '2-7 days',
        '8-30 days',
        '1-3 months',
        '4-12 months',
        '> 1 year',
        'Other' // add text box
    ];

    buildOptions(sleepingDurations, '#how-long-sleeping-there');

    $('#sleeping-duration-other').hide();

    $('#how-long-sleeping-there').change(function () {
        if($("#how-long-sleeping-there option:selected").text() === 'Other'){
            $('#sleeping-duration-other').show();
        }else{
            $('#sleeping-duration-other').hide();
        }
    });

    var numberEpisodes = ['1', '2', '3', '4', 'more than 4']; // add text box

    buildOptions(numberEpisodes, '#number-episodes');

    var initialCauses = [
        'Abuse by parent/caregiver',
        'Domestic violence',
        'Discharged from armed services',
        'End of relationship/break-up',
        'Parent/caregiver\'s mental health',
        'Release from hospital',
        'Exiting foster care',
        'Exiting jail/prison',
        'Exiting juvenile detention',
        'Family homelessness',
        'Parent/caregiver substance use',
        'Release from mental health facility',
        'Kicked out',
        'Loss of job',
        'Pregnancy',
        'Personal health issues',
        'Low/no income',
        'Personal mental health',
        'Sexual orientation',
        'Run away from DCFS',
        'Personal substance use',
        'Other'
    ];

    buildListItems(initialCauses, '#initial-causes', 'initial-causes-checkbox');

    var stableHousing = [
        'Unemployment',
        'Personal substance use',
        'Partner/friends',
        'Personal choice',
        'Don’t want to return to foster care',
        'Mental health',
        'Not sure what’s available',
        'Health issues',
        'Don’t want emergency shelter',
        'Traveling',
        'Not enough savings/income',
        'Others'
    ];

    buildListItems(stableHousing, '#keeping-from-stable-housing', 'keeping-from-stable-housing-checkbox');

    var housingOptions = [
        'Emergency shelter',
        'Permanent housing',
        'Family reunification',
        'Sober living'
    ];

    buildListItems(housingOptions, '#housing-options', 'housing-options-checkbox');

    var chronicallyHomeless = ['Yes', 'No'];

    buildOptions(chronicallyHomeless, '#chronically-homeless');

    var genderIdentity = [
        'Man',
        'Woman',
        'Trans*',
        'Non-gender binary',
        'Refuse to answer',
        'Other'
    ];

    buildListItems(genderIdentity, '#gender-identity', 'gender-identity-checkbox');

    var genderAssigned = [
        'Male',
        'Female',
        'Refuse to answer'
    ];

    buildListItems(genderAssigned, '#gender-assigned', 'gender-assigned-checkbox');

    var preferredPronoun = [
        'he/him/his',
        'she/her/hers',
        'they/them/theirs',
        'Other'
    ];

    buildListItems(preferredPronoun, '#preferred-pronoun', 'preferred-pronoun-checkbox');

    var ethnicities = [
        'Non-latinx',
        'Latinx',
        'Don\'t know',
        'Refused to answer'
    ];

    buildListItems(ethnicities, '#ethnicity', 'ethnicity-checkbox');

    var races = [
        'Asian',
        'Black',
        'Native Hawaiian/Pacific Islander',
        'White',
        'Native American/Alaskan Native',
        'Don\'t know',
        'Refuse to answer',
        'Other'
    ];

    buildListItems(races, '#race', 'race-checkbox');

    var education = [
        'High School',
        'Community College',
        'Trade School',
        '4 year college',
        'Grad School'
    ];

    buildListItems(education, '#some-education', 'some-education-checkbox');

    buildListItems(education, '#currently-attending', 'curently-attending-checkbox');

    buildListItems(education, '#graduated', 'graduated-checkbox');

    var languages = [
        'English',
        'Spanish',
        'Other'
    ];

    buildOptions(languages, '#first-language');

    var preferredLanguage = [
        'Spanish',
        'Other'
    ];

    buildOptions(preferredLanguage, '#preferred-language');

    var disabilities = [
        'Mental Health',
        'Physical',
        'Developmental',
        'Learning',
        'No',
        'Don\'t Know',
        'Refuse to Answer'
    ];

    buildListItems(disabilities, '#disability', 'disability-checkbox');

    var pregnant = [
        'yes',
        'no',
        'not sure'
    ];

    buildOptions(pregnant, '#currently-pregnant');

    var firstPregnancy = [
        'yes',
        'no'
    ];

    buildListItems(firstPregnancy, '#first-pregnancy', 'first-pregnancy-checkbox');

    var trimester = [
        '1st',
        '2nd',
        '3rd'
    ];

    buildOptions(trimester, '#trimester');




    var reunification = [
        'yes',
        'no'
    ];

    var contact = [
        'yes',
        'no'
    ];

    buildOptions(reunification, '#reunification-interest1');
    buildOptions(reunification, '#reunification-interest2');
    buildOptions(contact, '#okay-to-contact1');
    buildOptions(contact, '#okay-to-contact2');

    var casemanagement = [
      'still',
      'working',
      'on',
      'status',
      'labels'
    ];
    var educationemployment = [
      'still',
      'working',
      'on',
      'status',
      'labels'
    ];
    var dropin = [
      'still',
      'working',
      'on',
      'status',
      'labels'
    ];
    var outreach = [
      'still',
      'working',
      'on',
      'status',
      'labels'
    ];

    buildOptions(casemanagement, '#case-management');
    buildOptions(educationemployment, '#education-employment');
    buildOptions(dropin, '#dropin');
    buildOptions(outreach, '#outreach');
});
