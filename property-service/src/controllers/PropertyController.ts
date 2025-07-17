import { Request, Response } from "express";
import Property from "../model/Property";
import { propertyRepository } from "../repositories";

class PropertyController {
  static create = async (req: Request, res: Response) => {
    const {
      ownerId,
      title,
      description,
      price,
      location,
      addressLine,
      city,
      state,
      postalCode,
      country,
      isActive,
      type,
      facilities
    } = req.body;

    let property = new Property();

    property.ownerId = ownerId;
    property.title = title;
    property.description = description;
    property.price = price;
    property.location = location;
    property.addressLine = addressLine;
    property.city = city;
    property.state = state;
    property.postalCode = postalCode;
    property.country = country;
    property.isActive = isActive;
    property.type = type;
    property.facilities = facilities;

    try {
      property = await propertyRepository.save(property);

      res.send(property);
    } catch {
      res.sendStatus(400);
    }
  };

  static update = async (req: Request, res: Response) => {
    let property = await propertyRepository.findOneBy({ id: req.params.id });

    if (!property) {
      res.status(400).send({ error: "Property not found" });

      return;
    }

    property = {
      ...property,
      ...req.body,
      id: property.id
    } as Property;

    property = await propertyRepository.save(property);

    res.send(property);
  };

  static get = async (req: Request, res: Response) => {
    const property = await propertyRepository.findOneBy({ id: req.params.id });

    if (!property) {
      res.status(400).send({ error: "Property not found" });

      return;
    }

    res.send(property);
  };

  static delete = async (req: Request, res: Response) => {
    const property = await propertyRepository.findOneBy({ id: req.params.id });

    if (!property) {
      res.status(400).send({ error: "Property not found" });

      return;
    }

    await propertyRepository.remove(property);

    res.sendStatus(204);
  };

  static listForUser = async (req: Request, res: Response) => {
    const properties = await propertyRepository.find({ ownerId: req.params.ownerId });

    res.send(properties);
  };
}

export default PropertyController;
