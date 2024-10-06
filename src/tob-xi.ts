import { Address, BigInt } from "@graphprotocol/graph-ts";
import { TobXI, Approval, Transfer } from "../generated/TobXI/TobXI";
import { User } from "../generated/schema";

// export function handleApproval(event: Approval): void {
// Entities can be loaded from the store using a string ID; this ID
// needs to be unique across all entities of the same type
// let entity = ExampleEntity.load(event.transaction.from)

// Entities only exist after they have been saved to the store;
// `null` checks allow to create entities on demand
// if (!entity) {
// entity = new ExampleEntity(event.transaction.from)

// Entity fields can be set using simple assignments
// entity.count = BigInt.fromI32(0)
// }

// BigInt and BigDecimal math are supported
// entity.count = entity.count + BigInt.fromI32(1)

// Entity fields can be set based on event parameters
// entity.owner = event.params.owner
// entity.spender = event.params.spender

// Entities can be written to the store with `.save()`
// entity.save()
// }

function loadOrCreateUser(id: string): User {
  let user = User.load(id);
  if (user === null) {
    user = new User(id);
    user.balance = BigInt.fromI32(0);
    user.save();
  }

  return user;
}

export function handleTransfer(event: Transfer): void {
  let sender = loadOrCreateUser(event.params.from.toHexString());
  let receiver = loadOrCreateUser(event.params.to.toHexString());

  let amount = event.params.value;

  if(sender.id !== Address.zero().toHexString()){
    sender.balance = sender.balance.minus(amount);
  }

  receiver.balance = receiver.balance.plus(amount);

  sender.save();
  receiver.save();
}
