/**
 * Created by : Sukaran Golani
 */

const AWS = require("aws-sdk");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const guestUserHandler = (intentName) => {
  const response = {
    sessionState: {
      dialogAction: {
        type: "Close",
      },
      intent: {
        name: intentName,
        state: "Fulfilled",
      },
    },
    messages: [
      {
        contentType: "PlainText",
        content: "You need to log in to the application to access this feature",
      },
    ],
  };
  return response;
};

exports.handler = async (event) => {
  try {
    console.log(event);
    console.log(event.sessionState.intent.slots);
    var intentName = event.sessionState.intent.name;
    if (intentName === "NavigateIntent") {
      var pageName =
        event.sessionState.intent.slots.PageName.value.originalValue.toLowerCase();
      var url = "";
      if (pageName.includes("home")) url = "Home";
      else if (pageName.includes("login")) url = "Login";
      else if (pageName.includes("register") || pageName.includes("sign"))
        url = "Sign Up";
      var responseText = "";
      if (url) responseText = "Redirecting you to " + url + " page";
      else responseText = "Invalid input, please try again!";
      const response = {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            name: "NavigateIntent",
            state: "Fulfilled",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: responseText,
          },
        ],
      };
      return response;
    } else if (intentName === "OrderTrackingIntent") {
      if (event.sessionId === "GuestUser") {
        return guestUserHandler(intentName);
      } else {
        var username = event.sessionState.sessionAttributes.userId;
        var params = {
          TableName: "Orders",
          FilterExpression: "OrderNumber = :orderId and username = :username",
          ExpressionAttributeValues: {
            ":username": username,
            ":orderId":
              event.sessionState.intent.slots.OrderNumber.value.originalValue,
          },
        };

        var record = await dynamoDb.scan(params).promise();
        if (record.Items.length == 0) {
          const response = {
            sessionState: {
              dialogAction: {
                type: "Close",
              },
              intent: {
                name: intentName,
                state: "Fulfilled",
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content: "Invalid order id, please check and try again!",
              },
            ],
          };
          return response;
        } else {
          const response = {
            sessionState: {
              dialogAction: {
                type: "Close",
              },
              intent: {
                name: intentName,
                state: "Fulfilled",
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content:
                  "The status of your order is " + record.Items[0].orderStatus,
              },
            ],
          };
          return response;
        }
      }
    } else if (intentName === "RateOrderIntent") {
      if (event.sessionId === "GuestUser") {
        return guestUserHandler(intentName);
      } else {
        var username = event.sessionState.sessionAttributes.userId;
        var params = {
          TableName: "Orders",
          FilterExpression: "OrderNumber = :orderId and username = :username",
          ExpressionAttributeValues: {
            ":username": username,
            ":orderId":
              event.sessionState.intent.slots.OrderNumber.value.originalValue,
          },
        };

        var record = await dynamoDb.scan(params).promise();
        var rating = Math.floor(
          event.sessionState.intent.slots.Rating.value.originalValue
        );
        var feedback =
          event.sessionState.intent.slots.Feedback.value.originalValue;
        if (rating < 0 || rating > 5) {
          const response = {
            sessionState: {
              dialogAction: {
                type: "Close",
              },
              intent: {
                name: intentName,
                state: "Failed",
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content:
                  "Invalid rating given, please start over and rate out of 5.",
              },
            ],
          };
          return response;
        } else if (record.Items.length == 0) {
          const response = {
            sessionState: {
              dialogAction: {
                type: "Close",
              },
              intent: {
                name: intentName,
                state: "Fulfilled",
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content: "Invalid order id, please check and try again!",
              },
            ],
          };
          return response;
        } else {
          var params = {
            TableName: "Orders",
            Key: {
              OrderNumber:
                event.sessionState.intent.slots.OrderNumber.value.originalValue,
            },
            UpdateExpression: "set #a = :rating, #b = :feedback",
            ExpressionAttributeNames: { "#a": "rating", "#b": "feedback" },
            ExpressionAttributeValues: {
              ':feedback': feedback,
              ':rating': rating,
            },
            ReturnValues: "ALL_NEW",
          };
          var ratingItem = await dynamoDb.update(params).promise();
          console.log(ratingItem);
          const response = {
            sessionState: {
              dialogAction: {
                type: "Close",
              },
              intent: {
                name: intentName,
                state: "Fulfilled",
              },
            },
            messages: [
              {
                contentType: "PlainText",
                content:
                  "Rating for order number " +
                  event.sessionState.intent.slots.OrderNumber.value
                    .originalValue +
                  " has been updated successfully",
              },
            ],
          };
          return response;
        }
      }
    } else if (intentName === "AddRecipeIntent") {
      if (event.sessionId === "GuestUser") {
        return guestUserHandler(intentName);
      } else {
        var username = event.sessionState.sessionAttributes.userId;

        var RecipeName =
          event.sessionState.intent.slots.RecipeName.value.originalValue;
        var Price = event.sessionState.intent.slots.Price.value.originalValue;
        var Id = uuidv4();

        var params = {
          Item: {
            "Id" : Id,
            "RecipeName" : RecipeName,
            "Price" : Price,
            "OwnerId" : username
          },
          TableName: "Recipes",
        };

        var insertData = await dynamoDb.put(params).promise()     
        
        console.log(insertData)

        const response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              name: intentName,
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "Recipe added successfully",
            },
          ],
        };
        return response;
      }
    } else if (intentName === "OrderComplaintsIntent") {
      if (event.sessionId === "GuestUser") {
        return guestUserHandler(intentName);
      } else {
        var username = event.sessionState.sessionAttributes.userId;
        const data = {
          topicName: "customer_complaints",
          user: username,
        };
        const res = await axios.post(
          "https://cq5qkk3mkzulcplas3fkvzoyvi0hymmb.lambda-url.us-east-1.on.aws/",
          data
        );
        console.log(res.data);
        const response = {
          sessionState: {
            dialogAction: {
              type: "Close",
            },
            intent: {
              name: "OrderComplaintsIntent",
              state: "Fulfilled",
            },
          },
          messages: [
            {
              contentType: "PlainText",
              content: "Connecting you to a chat support representative",
            },
          ],
        };
        return response;
      }
    } else {
      const response = {
        sessionState: {
          dialogAction: {
            type: "Close",
          },
          intent: {
            name: intentName,
            state: "Failed",
          },
        },
        messages: [
          {
            contentType: "PlainText",
            content: "Some error occurred, please try again later.",
          },
        ],
      };
      return response;
    }
  } catch (e) {
    console.log(e);
    const response = {
      sessionState: {
        dialogAction: {
          type: "Close",
        },
        intent: {
          name: "FallbackIntent",
          state: "Failed",
        },
      },
      messages: [
        {
          contentType: "PlainText",
          content: "Some error occurred, please try again later.",
        },
      ],
    };
    return response;
  }
};
