import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { BadValuesError, NotAllowedError, NotFoundError } from "./errors";

export interface OrganizationDoc extends BaseDoc {
  author: ObjectId;
  name: string;
  description: string;
  privacy: string;
  members: string[];
}

/**
 * concept: Organizations
 */
export default class OrganizationConcept {
  public readonly organizations: DocCollection<OrganizationDoc>;

  /**
   * Make an instance of an Organization.
   */
  constructor(collectionName: string) {
    this.organizations = new DocCollection<OrganizationDoc>(collectionName);
  }

  async createOrg(author: ObjectId, name: string, description: string, privacy: string) {
    let members = [author.toString()];
    const _id = await this.organizations.createOne({author, name, description, privacy, members});
    return { msg: "Organization created successfully!", organization: await this.organizations.readOne({ _id }) };
  }

  async deleteOrg(_id: ObjectId) {
    await this.organizations.deleteOne({ _id });
    return { msg: "Organization deleted successfully!" };
  }

  async getByAuthor(author: ObjectId) {
    return await this.organizations.readMany({ author });
  }

  async getOrgs() {
    return await this.organizations.readMany({}, { sort: { _id: -1 } });
  }

  async updateOrg(_id: ObjectId, name?: string, description?: string) {
    await this.organizations.partialUpdateOne({ _id }, { name, description });
    return { msg: "Organization successfully updated!" };
  }

  async addMember(_id: ObjectId, member: string) {
    let org = await this.organizations.readOne({ _id });
    let members = org?.members;

    if (members !== undefined && !members.includes(member)) {
      members.push(member);
      await this.organizations.partialUpdateOne({ _id }, { members });
    }
    return { msg: "Organization member successfully added!" };
  }

  async deleteMember(_id: ObjectId, member: string) {
    let org = await this.organizations.readOne({ _id });
    let members = org?.members;

    if (members !== undefined && members.includes(member)) {
      const index = members.indexOf(member, 0);
      if (index > -1) {
        members.splice(index, 1);
        await this.organizations.partialUpdateOne({ _id }, { members });
      }
      return { msg: "Organization member successfully deleted!" };
    } else {
      return { msg: 'Member not in members list!' };
    }
  }

  async makePublic(_id: ObjectId) {
    let privacy = "public";
    await this.organizations.partialUpdateOne({ _id }, { privacy });
    return { msg: "Organization privacy successfully updated!" };
  }

  async makePrivate(_id: ObjectId) {
    let privacy = "private";
    await this.organizations.partialUpdateOne({ _id }, { privacy });
    return { msg: "Organization privacy successfully updated!" };
  }

  async assertAuthorIsUser(_id: ObjectId, user: ObjectId) {
    const org = await this.organizations.readOne({ _id });
    if (!org) {
      throw new NotFoundError(`Organization ${_id} does not exist!`);
    }
    if (org.author.toString() !== user.toString()) {
      throw new OrgAuthorNotMatchError(user, _id);
    }
  }

}

export class OrgAuthorNotMatchError extends NotAllowedError {
  constructor(
    public readonly author: ObjectId,
    public readonly _id: ObjectId,
  ) {
    super("{0} is not the author of organization {1}!", author, _id);
  }
}
