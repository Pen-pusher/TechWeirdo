import React, { Component, PureComponent } from "react";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import get from "lodash/get";
import { render } from "react-dom";

import Form from "react-jsonschema-form";

import "bootstrap/dist/css/bootstrap.min.css";

class CollapsibleFieldTemplate extends PureComponent {
  constructor(props) {
    super(props);

    const { formContext } = props;

    const topmostElement = this.isThisTheTopmostElement();

    this.state = {
      collapsed: topmostElement ? false : formContext.hideAll,
      topmostElement,
      hideAll: formContext.hideAll
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { formContext } = nextProps;
    const { hideAll, topmostElement } = state;

    if (hideAll !== formContext.hideAll) {
      return {
        collapsed: topmostElement ? false : formContext.hideAll,
        hideAll: formContext.hideAll
      };
    }

    return null;
  }

  isThisTheTopmostElement = () => {
    const { id } = this.props;

    return id === "root";
  };

  render() {
    const {
      label,
      help,
      required,
      description,
      errors,
      classNames,
      children,
      hidden,
      schema
    } = this.props;

    const { collapsed, hideAll } = this.state;

    const type = get(schema, "type", undefined);

    let legend = null;

    if (type !== "object" && type !== "array") {
      legend = label ? `${label}${required ? "*" : ""}` : null;
    } else if (collapsed) {
      legend = (
        <fieldset className="field field-array field-array-of-object">
          {label ? <legend>{`${label}${required ? "*" : ""}`}</legend> : null}
        </fieldset>
      );
    }

    let contentToRender = null;

    if (!collapsed) {
      contentToRender = (
        <React.Fragment>
          {type !== "object" && type !== "array" ? description : null}
          {children}
          {errors}
          {help}
        </React.Fragment>
      );
    }

    return (
      <React.Fragment>
        {hidden ? null : (
          <div className={classNames}>
            <React.Fragment>
              {!this.isThisTheTopmostElement() ? (
                <OverlayTrigger
                  placement="top"
                  delay={{ show: 300, hide: 100 }}
                  overlay={
                    <Tooltip>
                      {collapsed ? "Expand" : "Collapse"} the field
                      {!collapsed
                        ? `, resetting all of the field's children to being ${hideAll ? "collapsed" : "expanded"
                        }`
                        : ""}
                      .
                    </Tooltip>
                  }
                >
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    style={{
                      display: "inline-block",
                      float: "right",
                      fontSize: "large"
                    }}
                    onClick={() => this.setState({ collapsed: !collapsed })}
                  >
                    {collapsed ? (
                      <React.Fragment>
                        +
                        {get(errors, "props.errors", []).length ? (
                          <span style={{ fontSize: "small" }}>
                            {" "}
                            (Contains errors)
                          </span>
                        ) : null}
                      </React.Fragment>
                    ) : (
                      "-"
                    )}
                  </Button>
                </OverlayTrigger>
              ) : null}
              {legend ? <React.Fragment> {legend}</React.Fragment> : null}
              {contentToRender}
            </React.Fragment>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const schema = {
  title: "A registration form",
  description:
    "Fill the job application form below",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
      default: "Chuck"
    },
    lastName: {
      type: "string",
      title: "Last name"
    },
    age: {
      type: "integer",
      title: "Age"
    },
    Experience: {
      type: "object",
      description: "Describe your experience and stackk",
      properties: {
        Experience: {
          type: "string"
        },
        Stack: {
          type: "string"
        }
      }
    },
    Skills: {
      description: "Mention Your Skill Set",
      type: "array",
      items: {
        type: "string"
      }
    },
    gender: {
      type: "string",
      title: "Gender",
      anyOf: [
        {
          type: "string",
          title: "Male",
          enum: ["Male"]
        },
        {
          type: "string",
          title: "Female",
          enum: ["Female"]
        }
      ]
    },
    isworking: {
      type: "boolean",
      title: "Are you working?"
    },
    bio: {
      type: "string",
      title: "Bio"
    },
    telephone: {
      type: "string",
      title: "Telephone",
      minLength: 10
    }
  }
};

const formData = {
  firstName: "Pijush",
  lastName: "Chakraborty",
  age: 25,
  gender:"",
  isworking:"",
  bio: "I am full stack Mern dev",
Experience: {
    Experience: "2+ year of xperience",
    Stack: "MERN"
  },
  Skills: ["HTML", "CSS", "Javascript"]
};

const log = type => console.log.bind(console, type);

render(
  <Form
    schema={schema}
    autocomplete="on"
    formData={formData}
    FieldTemplate={CollapsibleFieldTemplate}
    formContext={{ hideAll: false }}
    onChange={log("changed")}
    onSubmit={log("submitted")}
    onError={log("errors")}
  />,
  document.getElementById("root")
);
