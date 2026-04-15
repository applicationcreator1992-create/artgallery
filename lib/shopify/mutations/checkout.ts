export const checkoutCompleteMutation = `
  mutation checkoutComplete($checkoutId: ID!) {
    checkoutComplete(checkoutId: $checkoutId) {
      checkout {
        id
        completedAt
        order {
          id
          name
          processedAt
          totalPriceV2 {
            amount
            currencyCode
          }
          lineItems(first: 50) {
            edges {
              node {
                title
                quantity
                variant {
                  id
                  title
                  inventoryQuantity
                }
              }
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;
