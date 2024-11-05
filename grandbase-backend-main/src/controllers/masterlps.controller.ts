import { type Request, type Response, type NextFunction } from 'express'

import Lp from "../models/master-lps.model";

export async function getAllLps(): Promise<Lp[]> {
  let data = await Lp.findAll();
  return data;
}

export async function api_getAll(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    let lps = await getAllLps();
    res.send({
      data: lps
    });
  } catch (err: any) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving lps."
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
    let num = await Lp.destroy({
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
    let [affectedCount] = await Lp.update(req.body, {
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
    let data = await Lp.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find Lp with id=${id}.`
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving Lp with id=" + id
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
    const lp = {
      name: req.body.name,
      address: req.body.address,
      decimals: req.body.decimals
    }
    let data = await Lp.create(lp);
    res.send(data);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating a Lp."
    });
  }
}

function validateRequest(req: Request, res: Response): boolean {
  // if false, res.status(400).send(...)
  console.log("validateRequest req =", req.body);
  return true;
}
