# Vulcan Social Button

## Create a social button in Vulcan js

This package:

1.  adds an array field to stock userIds,
2.  creates a mutation to push and pull userIds to this field
3.  registers a button out of the box so the user can call this mutation.

You can use this button to manage likes for posts or a sign/unsign up system for events.

## Installation

Clone this repo:

```sh
git clone https://github.com/live-for-good/vulcan-social
```

You can clone it directly in your app `packages` folder. You can also clone it in an isolated `vulcan-packages` folder outside of your app, and then set the `METEOR_PACKAGE_DIRS` environment variable to `"/some-dir/vulcan-packages"`. This way, you can put all your reusable package in this `vulcan-packages` folder without polluting your own app.

## Usage

1. Call in collection.js

To create the field schema, you will need to call the setUpSocialHandler function in your collection :

setUpSocialHandler({
collectionName: yourCollectionName, // or collection: yourCollection
});

The collection name or the collection itself is the only field that is required. The rest of the fields you have the option to add is :

- fieldName: string. It's going to be the name of the field you will create in the schema.
- resolveAsFieldName: string. It's going to be the name of the field schema you will create in the resolveAs.
- resolverName: string. It's the name you want to give to your resolver.
- buttonName: string. It's if you want to custom the button Name.
- canUpdate: Can either be a string, an array of group names, or a function. If it’s a function, it’ll be called on the user viewing the document and the document itself, and should return true or false.
- canRead: Can either be a string, an array of group names, or a function. If it’s a function, it’ll be called on the user viewing the document and the document itself, and should return true or false.
- fieldSchema : object. to pass al the other properties a schema field can take

Any other properties you want to pass to the schema should be given inside a fieldSchema object.

Once this is done, in your console, you will see the name of the button you have to call in your component.

2. Call in your front end component

Then you can use Components.YourButtonName. The only required properties are the document and the currentUserId.

The following props are optionals:

- successCallback: function
- errorCallback: function
- ButtonAdd: component
- ButtonRemove: component

Even if the successCallback is optional, we highly recommend thatto use it to refetch your data.

## More

Checkout more infos here: https://medium.com/live-for-good/how-we-created-and-abstracted-a-social-feature-with-vulcan-js-11639754b9ff

## Contributing

This package will evolve and improve depending on the use cases we encounter. Best way to contribute is to use it in your own app, and propose ideas, suggestions and PR based on your experience.

We seek for maximum reusability, so each method should be as configurable as possible, and split into independant functions whenever possible.
