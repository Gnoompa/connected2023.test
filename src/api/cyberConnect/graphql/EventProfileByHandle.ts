import { gql } from "@apollo/client";

export const EVENT_PROFILE_BY_HANDLE = gql`
  query ProfileByHandle($handle: String!) {
    profileByHandle(handle: $handle) {
      handle
      id
      profileID
      owner {
        address
      }
      essences {
        edges {
          node {
            name
            id
            essenceID
            tokenURI
            contractAddress
            collectMw {
              type
              data
              contractAddress
            }
          }
        }
      }
    }
  }
`;
