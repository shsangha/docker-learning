const { gql } = require('apollo-server-express');

module.exports = gql`
  scalar Date

  enum Category {
    TOP_LONG_SLEEVE_TEE
    TOP_POLO
    TOP_SHIRT_BUTTON_UP
    TOP_SHORT_SLEEVE_TEE
    TOP_SWEATERS_KNITWEAR
    TOP_SWEATSHIRTS_HOODIES
    TOP_TANK_TOP_SLEEVLESS
    TOP_JERSEYS

    BOTTOM_CASUAL_PANTS
    BOTTOM_CROPPED_PANTS
    BOTTOM_DENIM
    BOTTOM_LEGGINGS
    BOTTOM_OVERALL_JUMPSUIT
    BOTTOM_SHORTS
    BOTTOM_SWEATPANTS_JOGGERS
    BOTTOM_SWIMWEAR

    OUTERWEAR_BOMBERS
    OUTERWEAR_CLOAKS_CAPES
    OUTERWEAR_DENIM_JACKETS
    OUTERWEAR_HEAVY_COATS
    OUTERWEAR_LEATHER_JACKETS
    OUTERWEAR_LIGHT_JACKETS
    OUTERWEAR_PARKAS
    OUTERWEAR_RAINCOATS
    OUTERWEAR_VESTS

    FOOTWEAR_BOOTS
    FOOTWEAR_CASUAL_LEATHER_SHOES
    FOOTWEAR_FORMAL_SHOES
    FOOTWEAR_HI_TOP_SNEAKERS
    FOOTWEAR_LOW_TOP_SNEAKERS
    FOOTWEAR_SANDALS
    FOOTWEAR_SLIPONS

    TAILORING_BLAZERS
    TAILORING_FORMAL_SHIRTING
    TAILORING_FORMAL_TROUSERS
    TAILORING_SUITS
    TAILORING_TUXEDOS
    TAILORING_VESTS

    ACCESSORIES_BAGS_LUGGAGE
    ACCESSORIES_BELTS
    ACCESSORIES_GLASSES
    ACCESSORIES_GLOVES_SCARVES
    ACCESSORIES_HATS
    ACCESSORIES_JEWLERY
    ACCESSORIES_WALLETS
    ACCESSORIES_MISC
    ACCESSORIES_PERIODICALS
    ACCESSORIES_SOCKS_UNDERWEAR
    ACCESSORIES_SUNGLASSES
    ACCESSORIES_SUPREME
    ACCESSORIES_TIES_POCKETSQUARES
  }

  enum Market {
    GRAILED
    CORE
    HYPE
    SARTORIAL
  }

  interface Listing {
    itemID: String!
    sellerID: String!
    name: String!
    designer: String!
    category: Category!
    market: Market!
    size: String!
    price: Float!
    seller_location: String!
    description: String!
    posted: Date!
    views: Int!
    likes: Int!
    acceptOffers: Boolean!
  }

  type NoBuyNow implements Listing {
    itemID: String!
    sellerID: String!
    name: String!
    designer: String!
    category: Category!
    market: Market!
    size: String!
    price: Float!
    seller_location: String!
    description: String!
    posted: Date!
    views: Int!
    likes: Int!
    acceptOffers: Boolean!
  }

  type PurchaseOptions {
    country: String!
    price: Float!
  }

  type BuyNow implements Listing {
    itemID: String!
    sellerID: String!
    name: String!
    designer: String!
    category: Category!
    market: Market!
    size: String!
    price: Float!
    seller_location: String!
    description: String!
    posted: Date!
    views: Int!
    likes: Int!
    acceptOffers: Boolean!
    buyNowOptions: [PurchaseOptions!]!
  }

  type Query {
    getSuggestions(input: String!, size: Int!, sold: Boolean!): [String]
    seeIndex: String
  }

  type Mutation {
    test: String
  }
`;
