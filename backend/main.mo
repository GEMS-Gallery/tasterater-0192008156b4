import Bool "mo:base/Bool";
import Func "mo:base/Func";
import Hash "mo:base/Hash";
import Int "mo:base/Int";

import Array "mo:base/Array";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Text "mo:base/Text";

actor {
    // Define the Recipe type
    type Recipe = {
        id: Nat;
        title: Text;
        ingredients: [Text];
        instructions: Text;
        upvotes: Nat;
        downvotes: Nat;
    };

    // Stable variable to store recipes
    stable var recipeEntries : [(Nat, Recipe)] = [];
    var recipes = HashMap.HashMap<Nat, Recipe>(0, Nat.equal, Nat.hash);

    // Counter for generating unique recipe IDs
    stable var nextId : Nat = 0;

    // Initialize the recipes HashMap from stable storage
    system func preupgrade() {
        recipeEntries := Iter.toArray(recipes.entries());
    };

    system func postupgrade() {
        recipes := HashMap.fromIter<Nat, Recipe>(recipeEntries.vals(), 1, Nat.equal, Nat.hash);
    };

    // Function to add a new recipe
    public func addRecipe(title: Text, ingredients: [Text], instructions: Text) : async Nat {
        let id = nextId;
        nextId += 1;

        let newRecipe : Recipe = {
            id;
            title;
            ingredients;
            instructions;
            upvotes = 0;
            downvotes = 0;
        };

        recipes.put(id, newRecipe);
        id
    };

    // Function to vote on a recipe
    public func voteRecipe(id: Nat, isUpvote: Bool) : async Bool {
        switch (recipes.get(id)) {
            case (null) {
                return false; // Recipe not found
            };
            case (?recipe) {
                let updatedRecipe = if (isUpvote) {
                    {recipe with upvotes = recipe.upvotes + 1}
                } else {
                    {recipe with downvotes = recipe.downvotes + 1}
                };
                recipes.put(id, updatedRecipe);
                return true;
            };
        };
    };

    // Function to get all recipes
    public query func getAllRecipes() : async [Recipe] {
        Iter.toArray(recipes.vals())
    };

    // Function to get a specific recipe
    public query func getRecipe(id: Nat) : async ?Recipe {
        recipes.get(id)
    };

    // Function to calculate stars for a recipe
    public query func getRecipeStars(id: Nat) : async ?Float {
        switch (recipes.get(id)) {
            case (null) {
                null // Recipe not found
            };
            case (?recipe) {
                let totalVotes = recipe.upvotes + recipe.downvotes;
                if (totalVotes == 0) {
                    ?0
                } else {
                    let starRating = Float.fromInt(recipe.upvotes) / Float.fromInt(totalVotes) * 5;
                    ?starRating
                }
            };
        };
    };
}
