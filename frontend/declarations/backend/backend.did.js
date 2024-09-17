export const idlFactory = ({ IDL }) => {
  const Recipe = IDL.Record({
    'id' : IDL.Nat,
    'upvotes' : IDL.Nat,
    'title' : IDL.Text,
    'instructions' : IDL.Text,
    'downvotes' : IDL.Nat,
    'ingredients' : IDL.Vec(IDL.Text),
  });
  return IDL.Service({
    'addRecipe' : IDL.Func(
        [IDL.Text, IDL.Vec(IDL.Text), IDL.Text],
        [IDL.Nat],
        [],
      ),
    'getAllRecipes' : IDL.Func([], [IDL.Vec(Recipe)], ['query']),
    'getRecipe' : IDL.Func([IDL.Nat], [IDL.Opt(Recipe)], ['query']),
    'getRecipeStars' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Float64)], ['query']),
    'voteRecipe' : IDL.Func([IDL.Nat, IDL.Bool], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };
