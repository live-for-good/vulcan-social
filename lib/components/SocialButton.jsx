import React, { useState } from "react";
import { withMutation, registerComponent } from "meteor/vulcan:core";
import Fab from "@material-ui/core/Fab";
import ThumbUpAltOutlinedIcon from "@material-ui/icons/ThumbUpAltOutlined";
import ThumbUpAltIcon from "@material-ui/icons/ThumbUpAlt";
import _get from "lodash/get";
import PropTypes from "prop-types";

export const registerSocialButtonToDisplay = ({
  resolverName,
  _buttonName,
  fieldName,
}) => {
  export const SocialButton = ({
    document,
    currentUserId,
    successCallback,
    ButtonAdd,
    ButtonRemove,
    errorCallback,
    ...args
  }) => {
    const documentId = _get(document, "_id");
    const ownDocument = currentUserId === _get(document, "userId");

    const [isAddingUp, setIsAddingUp] = useState(
      document && document[fieldName] !== undefined
        ? !(document[fieldName] && document[fieldName].includes(currentUserId))
        : null
    );

    const handleClick = async () => {
      if (currentUserId && documentId) {
        args[resolverName]({
          documentId: documentId,
          currentUserId: currentUserId,
          isAddingUp: isAddingUp,
        })
          .then(() => {
            setIsAddingUp(!isAddingUp);
          })
          .then(() => successCallback && successCallback())
          .catch(err => {
            if (errorCallback) {
              errorCallback();
            } else {
              alert(err);
              let error = new Error(["Mutation failure"]);
              error.break = true;
              throw error;
            }
          });
      } else {
        alert("Missing parameter");
        let error = new Error(["Missing parameter"]);
        error.break = true;
        throw error;
      }
    };
    return (
      !ownDocument &&
      (isAddingUp ? (
        ButtonAdd ? (
          <ButtonAdd onClick={() => handleClick()} />
        ) : (
          <Fab
            color="primary"
            aria-label="add from the list"
            size="small"
            style={{ padding: "6px" }}
            onClick={() => handleClick()}
          >
            <ThumbUpAltOutlinedIcon />
          </Fab>
        )
      ) : ButtonRemove ? (
        <ButtonRemove onClick={() => handleClick()} />
      ) : (
        <Fab
          color="primary"
          aria-label="remove from the list"
          size="small"
          style={{ padding: "6px" }}
          onClick={() => handleClick()}
        >
          <ThumbUpAltIcon />
        </Fab>
      ))
    );
  };
  const mutationOptions = {
    name: resolverName,
    args: {
      documentId: "String",
      currentUserId: "String",
      isAddingUp: "Boolean",
    },
  };

  const SocialButtonWithMutation = withMutation(mutationOptions)(SocialButton);

  SocialButton.propTypes = {
    currentUserId: PropTypes.string.isRequired,
    document: PropTypes.shape({
      _id: PropTypes.string,
      userId: PropTypes.string,
      [fieldName]: PropTypes.array,
    }).isRequired,
    /** A function that will be trigger when the mutation successed.*/
    successCallback: PropTypes.func,
    /** A function that will be trigger when the mutation fails. If none is provided, it's an alert.*/
    errorCallback: PropTypes.func,
    /** To replace the ThumbsUpFab if needed*/
    ButtonAdd: PropTypes.func,
    /** To replace the ThumbsDownFab if needed*/
    ButtonRemove: PropTypes.func,
  };

  SocialButton.defaultProps = {
    canRead: ["members"],
    canUpdate: ["members"],
  };

  registerComponent({
    name: _buttonName,
    component: SocialButtonWithMutation,
  });
};
