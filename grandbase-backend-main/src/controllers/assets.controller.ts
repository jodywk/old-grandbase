import { type Request, type Response, type NextFunction } from 'express'

import SynAsset from "../models/syn-assets.model";

export async function getAllSynAssets(): Promise<SynAsset[]> {
  let data = await SynAsset.findAll({
    // where: {
    //   isAllowed: 1
    // }
  });
  return data;
}

export async function api_getAll(
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    let assets = await getAllSynAssets();
    res.send({
      data: assets
    });
  } catch (err: any) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving assets."
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
    let num = await SynAsset.destroy({
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
    let [affectedCount] = await SynAsset.update(req.body, {
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
    let data = await SynAsset.findByPk(id);
    if (data) {
      res.send(data);
    } else {
      res.status(404).send({
        message: `Cannot find SynAsset with id=${id}.`
      });
    }
  } catch (e) {
    res.status(500).send({
      message: "Error retrieving SynAsset with id=" + id
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
    const asset = {
      name: req.body.name,
      desc: req.body.desc,
      address: req.body.address,
      type: req.body.type,
      decimals: req.body.decimals
    }
    let data = await SynAsset.create(asset);
    res.send(data);
  } catch (err: any) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating a SynAsset."
    });
  }
}

function validateRequest(req: Request, res: Response): boolean {
  // if false, res.status(400).send(...)
  console.log("validateRequest req =", req.body);
  return true;
}
