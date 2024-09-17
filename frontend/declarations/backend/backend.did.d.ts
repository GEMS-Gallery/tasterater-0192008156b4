import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Recipe {
  'id' : bigint,
  'upvotes' : bigint,
  'title' : string,
  'instructions' : string,
  'downvotes' : bigint,
  'ingredients' : Array<string>,
}
export interface _SERVICE {
  'addRecipe' : ActorMethod<[string, Array<string>, string], bigint>,
  'getAllRecipes' : ActorMethod<[], Array<Recipe>>,
  'getRecipe' : ActorMethod<[bigint], [] | [Recipe]>,
  'getRecipeStars' : ActorMethod<[bigint], [] | [number]>,
  'voteRecipe' : ActorMethod<[bigint, boolean], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
