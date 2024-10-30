import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";

export interface InviteDoc extends BaseDoc {
  event: ObjectId;
  from: ObjectId;
  to: ObjectId;
  status: "pending" | "rejected" | "accepted";
}

/**
 * concept: Inviting [User]
 */
export default class InvitingConcept {
  public readonly invites: DocCollection<InviteDoc>;

  /**
   * Make an instance of Invite.
   */
  constructor(collectionName: string) {
    this.invites = new DocCollection<InviteDoc>(collectionName);
  }

  async sendInvite(event: ObjectId, from: ObjectId, to: ObjectId) {
    await this.canSendInvite(event, from, to);
    await this.invites.createOne({ event, from, to, status: "pending" });
    return { msg: "Sent invite!" };
  }

  async acceptInvite(event: ObjectId, from: ObjectId, to: ObjectId) {
    await this.removePendingInvite(event, from, to);
    await this.invites.createOne({ event, from, to, status: "accepted" });
    return { msg: "Accepted invite!" };
  }

  async rejectInvite(event: ObjectId, from: ObjectId, to: ObjectId) {
    await this.removePendingInvite(event, from, to);
    await this.invites.createOne({ event, from, to, status: "rejected" });
    return { msg: "Rejected invite!" };
  }

  async removeInvite(event: ObjectId, from: ObjectId, to: ObjectId) {
    await this.removePendingInvite(event, from, to);
    return { msg: "Removed invite!" };
  }

  async getInvites(user: ObjectId) {
    return await this.invites.readMany({
      $or: [{ from: user }, { to: user }],
    });
  }

  private async removePendingInvite(event: ObjectId, from: ObjectId, to: ObjectId) {
    const invite = await this.invites.popOne({ event, from, to, status: "pending" });
    if (invite === null) {
      throw new Error("Invite does not exist!");
    }
    return invite;
  }

  private async canSendInvite(event: ObjectId, from: ObjectId, to: ObjectId) {
    // check if there is pending invite
    const allInvites = await this.invites.readMany({}, { sort: { _id: -1 } });

    for (const invite of allInvites) {
      if (invite.event.equals(event) && invite.from.equals(from) && invite.to.equals(to)) {
        throw new Error("Invite already exists!");
      }
    }
  }
}
