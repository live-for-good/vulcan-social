import Users from "meteor/vulcan:users";
import _get from "lodash/get";
import { extendFragment } from "meteor/vulcan:core";
import { addSocialMutation } from "../server/resolvers";
import { registerSocialButtonToDisplay } from "../components/SocialButton";
import { getDefaultFragmentName } from "meteor/vulcan:more-helpers";
import PropTypes from "prop-types";
import { extractCollectionInfo } from "meteor/vulcan:lib";

export const setUpSocialHandler = ({
  collection: _collection,
  collectionName: _collectionName,
  fieldName = "socialUserIdList",
  resolveAsFieldName = "socialUserList",
  canUpdate = ["members"],
  canRead = ["members"],
  resolverName,
  fieldSchema,
  buttonName,
}) => {
  const _buttonName = buttonName ? buttonName : `${fieldName}Button`;
  console.log("To access the button, you can use Components.", _buttonName);
  const definitionArrayItem = fieldName + ".$";

  const { collection, collectionName } = extractCollectionInfo({
    collection: _collection,
    collectionName: _collectionName,
  });

  const _resolverName = resolverName || `${collectionName + fieldName}Resolver`;
  collection.addField([
    {
      fieldName: fieldName,
      fieldSchema: {
        type: Array,
        optional: true,
        defaultValue: [],
        canRead: canRead,
        canUpdate: canUpdate,
        resolveAs: {
          fieldName: resolveAsFieldName,
          type: "[User]",
          resolver: async (document, args, { currentUser, Users }) => {
            if (document[fieldName]) {
              const socialUserList = await Users.loader.loadMany(
                document[fieldName]
              );
              return Users.restrictViewableFields(
                currentUser,
                Users,
                socialUserList
              );
            } else {
              return [];
            }
          },
          addOriginalField: true,
        },
        ...fieldSchema,
      },
    },
    {
      fieldName: definitionArrayItem,
      fieldSchema: { type: String },
    },
  ]);

  extendFragment(
    getDefaultFragmentName(collection),
    `
    ${fieldName}
  `
  );
  // call add socialMutation  fieldName/collection
  addSocialMutation({
    fieldName,
    collectionName,
    resolverName: _resolverName,
  });

  registerSocialButtonToDisplay({
    resolverName: _resolverName,
    _buttonName: _buttonName,
    fieldName: fieldName,
  });
};

setUpSocialHandler.propTypes = {
  /** The collection in which field will be added */
  collection: PropTypes.object,
  collectionName: PropTypes.string,

  canRead: PropTypes.arrayOf(PropTypes.string),
  canUpdate: PropTypes.arrayOf(PropTypes.string),
  /** Name of the resolver   */
  resolveAsFieldName: PropTypes.string,
  /**fieldProperties that can be changed   */
  fieldName: PropTypes.string,
  /** To override any the schema fields with your own object   */
  fieldSchema: PropTypes.object,
};
