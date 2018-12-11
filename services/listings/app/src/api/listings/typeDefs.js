const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  enum MarketEnum {
    GRAILS
    HYPE
    SARTORIAL
    CORE
  }

  enum CategoryEnum {
    LONG_SLEEVE_TEE
    POLO
    SHIRT_BUTTON_UP
    SHORT_SLEEVE_TEE
    SWEATERS_KNITWEAR
    SWEATSHIRTS_HOODIES
    TANKS_SLEEVLESS
    JERSEYS
    CASUAL_PANTS
    CROPPED_PANTS
    DENIM
    LEGGINGS
    OVERALLS_JUMPSUITS
    SHORTS
    SWEATPANTS_JOGGERS
    SWIMWEAR
    BOMBERS
    CLOAKS_CAPES
    DENIM_JACKETS
    HEAVY_COATS
    LEATHER_JACKETS
    LIGHT_JACKETS
    PARKAS
    RAINCOATS
    OW_VESTS
    BOOTS
    CASUAL_LEATHER_SHOES
    FORMAL_SHOES
    HI_TOP_SNEAKERS
    LOW_TOP_SNEAKERS
    SANDALS
    SLIP_ONS
    BLAZERS
    FORMAL_SHIRTING
    FORMAL_TROUSERS
    SUITS
    TUXEDOS
    TAILORING_VESTS
    BAGS_LUGGAGE
    BELTS
    GLASSES
    GLOVES_SCARVES
    HATS
    JEWLERY_WATCHES
    WALLETS
    MISC
    PERIODICALS
    SOCKS_UNDERWEAR
    SUNGLASSES
    SUPREME
    TIES_POCKETSQUARES
  }

  type Comment {
    senderId: ID!
    comment: String!
  }

  type ShippingPrices {
    country: String!
    price: Float!
  }

  interface BaseListing {
    seller: ID!
    posted: Date!
    market: MarketEnum!
    category: CategoryEnum!
    likes: Int!
    description: String!
    photos: [String!]!
    title: String!
    acceptOffers: Boolean!
    designer: [String!]!
    comments: [Comment]
    views: Int
  }

  type Listing implements BaseListing {
    seller: ID!
    posted: Date!
    market: MarketEnum!
    category: CategoryEnum!
    likes: Int!
    description: String!
    photos: [String!]!
    title: String!
    acceptOffers: Boolean!
    designer: [String!]!
    comments: [Comment]
    views: Int
  }

  type BuyNowListing implements BaseListing {
    seller: ID!
    posted: Date!
    market: MarketEnum!
    category: CategoryEnum!
    likes: Int!
    description: String!
    photos: [String!]!
    title: String!
    acceptOffers: Boolean!
    designer: [String!]!
    comments: [Comment]
    shipping: [ShippingPrices]
    views: Int
  }

  type Query {
    testQuery: String
  }

  type Mutation {
    testMutation: String
  }
`;
