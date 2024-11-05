import { type Request, type Response, type NextFunction } from 'express'
import { LATEST_PRICE_DATA } from '../service/priceUpdateService';

import Contract from "../models/contracts.model";

export async function getAllContracts(): Promise<Contract[]> {
  let data = await Contract.findAll();
  return data;
}

export async function api_getAll(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    let contracts = await getAllContracts();
    res.send({
      data: contracts
    });
  } catch (err: any) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving contracts."
    });
  }
}

export async function api_delete(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const id = req.params.id;
  try {
    let num = await Contract.destroy({
      where: { id }
    });
    if (num === 1) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (e) {
    res.status(500).send({
      success: false
    });
  }
}

export async function api_update(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (!validateRequest(req, res)) return;
  const id = req.params.id;
  // todo: add validation of req.body
  try {
    let [affectedCount] = await Contract.update(req.body, {
      where: { id }
    });
    if (affectedCount === 1) {
      res.send({ success: true });
    } else {
      res.send({ success: false });
    }
  } catch (e) {
    res.status(500).send({
      success: false
    });
  }
}

export async function api_getOne(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const id = req.params.id;
  try {
    let data = await Contract.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Contract with id=${id}.`
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving Contract with id=" + id
    });
  }
}

export async function api_create(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (!validateRequest(req, res)) return;
  try {
    const contract = {
      name: req.body.name,
      address: req.body.address
    }
    let data = await Contract.create(contract);
    res.send(data);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating a Contract."
    });
  }
}

function validateRequest(req: Request, res: Response): boolean {
  // if false, res.status(400).send(...)
  console.log("validateRequest req =", req.body);
  return true;
}
