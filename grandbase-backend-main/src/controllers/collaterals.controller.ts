import { type Request, type Response, type NextFunction } from 'express'

import Collateral from "../models/collaterals.model";

export async function getAllCollaterals(): Promise<Collateral[]> {
  let data = await Collateral.findAll();
  return data;
}

export async function api_getAll(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    let collaterals = await getAllCollaterals();
    res.send({
      data: collaterals
    });
  } catch (err: any) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving collaterals."
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
    let num = await Collateral.destroy({
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
    let [affectedCount] = await Collateral.update(req.body, {
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
    let data = await Collateral.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Collateral with id=${id}.`
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving Collateral with id=" + id
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
    const collateral = {
      name: req.body.name,
      address: req.body.address,
      decimals: req.body.decimals
    }
    let data = await Collateral.create(collateral);
    res.send(data);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating a Collateral."
    });
  }
}

function validateRequest(req: Request, res: Response): boolean {
  // if false, res.status(400).send(...)
  console.log("validateRequest req =", req.body);
  return true;
}
