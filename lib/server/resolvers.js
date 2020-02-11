import { addGraphQLMutation, addGraphQLResolvers } from "meteor/vulcan:core";
import PropTypes from "prop-types";

export const addSocialMutation = ({
  fieldName,
  collectionName,
  resolverName,
}) => {
  // that is given from back end - saving the mutation
  addGraphQLMutation(
    `${resolverName}(documentId: String, currentUserId: String, isAddingUp:Boolean ) : JSON`
  ); // that is given from the front end

  const addOrDeleteParticipantResolver = {
    Mutation: {
      [resolverName](root, { documentId, currentUserId, isAddingUp }, context) {
        return isAddingUp
          ? context[collectionName].update(
              { _id: documentId },
              {
                $push: {
                  [fieldName]: currentUserId,
                },
              }
            )
          : context[collectionName].update(
              { _id: documentId },
              {
                $pull: {
                  [fieldName]: currentUserId,
                },
              }
            );
      },
    },
  };
  addGraphQLResolvers(addOrDeleteParticipantResolver);
};

addSocialMutation.propTypes = {
  /** The collection in which field will be added */
  collection: PropTypes.object.isRequired,
  resolverName: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
};
