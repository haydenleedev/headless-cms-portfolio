import { useEffect, useRef, useState } from "react";
import style from "./renderFormFields.module.scss";

const RenderFormFields = ({ fields }) => {
  const [errors, setErrors] = useState([]);

  const isHiddenField = (field) => {
    // Blacklist hidden fields from Pardot form handler fields
    const hiddenFields = [/ga_/, /utm_/, /current lead/, /hidden/, /hide/];

    // Check whether form field is blacklisted
    if (
      hiddenFields.some((re) => re.test(String(field.name).toLocaleLowerCase()))
    )
      return true;
    return false;
  };

  const isSelectField = (field) => {
    const countries = [
      "Country (Company HQ)",
      "United States",
      "United Kingdom",
      "Australia",
      "Canada",
      "Afghanistan",
      "Åland Islands",
      "Albania",
      "Algeria",
      "American Samoa",
      "Andorra",
      "Angola",
      "Anguilla",
      "Antarctica",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bermuda",
      "Bhutan",
      "Bolivia, Plurinational State of",
      "Bonaire, Sint Eustatius and Saba",
      "Bosnia and Herzegovina",
      "Botswana",
      "Bouvet Island",
      "Brazil",
      "British Indian Ocean Territory",
      "Brunei Darussalam",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cape Verde",
      "Cayman Islands",
      "Central African Republic",
      "Chad",
      "Chile",
      "China",
      "Christmas Island",
      "Cocos (Keeling) Islands",
      "Colombia",
      "COM",
      "Congo, the Democratic Republic of the",
      "Congo",
      "Cook Islands",
      "Costa Rica",
      "Côte d'Ivoire",
      "Croatia",
      "Cuba",
      "Curaçao",
      "Cyprus",
      "Czech Republic",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Ethiopia",
      "Falkland Islands (Malvinas)",
      "Faroe Islands",
      "Fiji",
      "Finland",
      "France",
      "French Guiana",
      "French Polynesia",
      "French Southern Territories",
      "Gabon",
      "Gambia",
      "Georgia",
      "Germany",
      "Ghana",
      "Gibraltar",
      "Greece",
      "Greenland",
      "Grenada",
      "Guadeloupe",
      "Guam",
      "Guatemala",
      "Guernsey",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Heard Island and McDonald Islands",
      "Holy See (Vatican City State)",
      "Honduras",
      "Hong Kong",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran, Islamic Republic of",
      "Iraq",
      "Ireland",
      "Isle of Man",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jersey",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea, Democratic People's Republic of",
      "Korea, Republic of",
      "Kuwait",
      "Kyrgyzstan",
      "Lao People's Democratic Republic",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "LBY",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macao",
      "Macedonia, the former Yugoslav Republic of",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands",
      "Martinique",
      "Mauritania",
      "Mauritius",
      "Mayotte",
      "Mexico",
      "Micronesia, Federated States of",
      "Moldova, Republic of",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Montserrat",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands",
      "New Caledonia",
      "New Zealand",
      "Nicaragua",
      "Niger",
      "Nigeria",
      "Niue",
      "Norfolk Island",
      "Northern Mariana Islands",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestinian Territory, Occupied",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines",
      "Pitcairn",
      "Poland",
      "Portugal",
      "Puerto Rico",
      "Qatar",
      "Réunion",
      "Romania",
      "Russian Federation",
      "Rwanda",
      "Saint Barthélemy",
      "Saint Helena, Ascension and Tristan da Cunha",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Martin (French part)",
      "Saint Pierre and Miquelon",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Sint Maarten (Dutch part)",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Georgia and the South Sandwich Islands",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan",
      "Suriname",
      "Svalbard and Jan Mayen",
      "Swaziland",
      "Sweden",
      "Switzerland",
      "Syrian Arab Republic",
      "Taiwan, Province of China",
      "Tajikistan",
      "Tanzania, United Republic of",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tokelau",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Turks and Caicos Islands",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates",
      "United Kingdom",
      "United States",
      "United States Minor Outlying Islands",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela, Bolivarian Republic of",
      "Viet Nam",
      "Virgin Islands, British",
      "Virgin Islands, U.S.",
      "Wallis and Futuna",
      "Western Sahara",
      "Yemen",
      "Zambia",
      "Zimbabwe",
    ];
    const states = [
      "State (Company HQ)",
      "Alaska",
      "Alabama",
      "Arkansas",
      "Arizona",
      "California",
      "Colorado",
      "Connecticut",
      "Washington DC",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Iowa",
      "Idaho",
      "Illinois",
      "Indiana",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Massachusetts",
      "Maryland",
      "Maine",
      "Michigan",
      "Minnesota",
      "Missouri",
      "Mississippi",
      "Montana",
      "North Carolina",
      "North Dakota",
      "Nebraska",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "Nevada",
      "New York",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Virginia",
      "Vermont",
      "Washington",
      "Wisconsin",
      "West Virginia",
      "Wyoming",
    ];
    const selectFields = [
      { regex: /country/, options: countries },
      { regex: /state/, options: states },
    ];
    for (let i = 0; i < selectFields.length; i++) {
      if (selectFields[i].regex.test(String(field.name).toLocaleLowerCase())) {
        field.options = selectFields[i].options;
        return true;
      }
    }
    return false;
  };

  const FormFieldWrapper = ({ field, children }) => (
    <div
      className={isHiddenField(field) ? style.formFieldHidden : style.formField}
    >
      <FormFieldLabel field={field}></FormFieldLabel>
      {children}
      <FormFieldError field={field}></FormFieldError>
    </div>
  );

  const FormFieldLabel = ({ field }) => (
    <label htmlFor={field.id}>
      <span className="">*</span> {field.name}
    </label>
  );

  // TODO: create error handling by pushing error field id to array.
  const FormFieldError = ({ field }) => {
    if (errors.includes(fields.id)) {
      return <span className={style.error}>{field.errorMessage}</span>;
    } else {
      return null;
    }
  };

  const getFormField = (field) => {
    if (isSelectField(field)) {
      field.dataFormat = "select";
    }
    switch (field.dataFormat) {
      case "email":
        return (
          <FormFieldWrapper field={field}>
            <input
              hidden={isHiddenField(field)}
              name={field.name}
              id={field.id}
              autoComplete="email"
              maxLength="50"
              required={field.isRequired}
            />
          </FormFieldWrapper>
        );
      // TODO: Phoen is also returned as number type, so have to detect if field.name contains "Phone",
      // And render phone type and not number....
      case "phone":
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              type="phone"
              title={field.name}
              hidden={isHiddenField(field)}
            ></input>
          </FormFieldWrapper>
        );
      case "number":
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              type="number"
              title={field.name}
              hidden={isHiddenField(field)}
            ></input>
          </FormFieldWrapper>
        );
      case "text":
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              maxLength="50"
              hidden={isHiddenField(field)}
              required={field.isRequired}
            />
          </FormFieldWrapper>
        );
      case "select":
        return (
          <>
            {field.options.length > 0 ? (
              <FormFieldWrapper field={field}>
                <select>
                  {field.options.map((option, index) => {
                    return (
                      <option
                        key={`selectOption${index}`}
                        value={index == 0 ? "" : option}
                        label={option}
                      ></option>
                    );
                  })}
                </select>
              </FormFieldWrapper>
            ) : null}
          </>
        );
      default:
        return (
          <FormFieldWrapper field={field}>
            <input
              name={field.name}
              id={field.id}
              maxLength="50"
              required={field.isRequired}
            />
          </FormFieldWrapper>
        );
    }
  };

  return fields.map((field) => getFormField(field));
};

export default RenderFormFields;
