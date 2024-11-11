// Library
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

// Create member
exports.createMember = async (req, res) => {
  const { nama_member, alamat, no_telepon, email } = req.body;

  const foto_member = req.file.path;

  try {
    const sendData = await prisma.member.create({
      data: {
        nama_member: nama_member,
        alamat: alamat,
        no_telepon: no_telepon,
        email: email,
        foto_member: foto_member,
      },
    });

    return res.status(200).json({
      messege: "Member succescfully created",
      data: sendData,
    });
  } catch (error) {
    console.log("error saving book", error);
    return res.status(500).json({
      message: "There was an error creating the member data",
      error: error.message,
    });
  }
};

// Get all member
exports.getAllMember = async (req, res) => {
  try {
    const memberData = await prisma.member.findMany();

    return res.status(200).json({
      message: "Members fetched successfully",
      data: memberData,
    });
  } catch (error) {
    console.log("Error fetching members:", error);
    return res.status(500).json({
      message: "There was an error fetching the members",
      error: error.message,
    });
  }
};

// Get detail member
exports.getMemberById = async (req, res) => {
  const memberId = req.params.id;
  try {
    const memberData = await prisma.member.findUnique({
      where: {
        id_member: Number(memberId),
      },
    });

    if (memberData) {
      const imageUrl = `${req.protocol}://${req.get("host")}/${
        memberData.foto_member
      }`;

      return res.status(200).json({
        message: "Member found successfully",
        data: { memberData, foto_member: imageUrl },
      });
    }

    return res.status(404).json({
      message: "Member not found",
    });
  } catch (error) {
    console.log("Error fetching member by ID", error);
    return res.status(500).json({
      message: "There was an error fetching the member data",
      error: error.message,
    });
  }
};

// Update member
exports.updateMemberById = async (req, res) => {
  const memberId = req.params.id;

  const { nama_member, alamat, no_telepon, email } = req.body;

  const updateData = {};

  try {
    const memberData = await prisma.member.findUnique({
      where: { id_member: Number(memberId) },
    });

    if (!memberData) {
      return res.status(404).json({
        message: "Member not found",
      });
    }

    if (nama_member) {
      updateData.nama_member = nama_member;
    }

    if (alamat) {
      updateData.alamat = alamat;
    }

    if (no_telepon) {
      updateData.no_telepon = no_telepon;
    }

    if (email) {
      updateData.email = email;
    }
    
    if (req.file) {
      updateData.foto_member = req.file.path;
    }

    const updatedMember = await prisma.member.update({
      where: {
        id_member: Number(memberId),
      },
      data: updateData,
    });

    return res.status(200).json({
      message: "Member successfully updated",
      data: updatedMember,
    });
  } catch (error) {
    console.log("Error updating member:", error);
    return res.status(500).json({
      message: "There was an error updating the member data",
      error: error.message,
    });
  }
};

// Delete member
exports.deleteMemberById = async (req, res) => {
  const memberId = req.params.id;

  try {
    const deleteData = await prisma.member.delete({
      where: {
        id_member: Number(memberId),
      },
    });

    return res.status(200).json({
      message: "Member successfully deleted",
    });
  } catch (error) {
    console.log("Error deleting Member:", error);
    return res.status(500).json({
      message: "There was an error deleting the Member",
      error: error.message,
    });
  }
};
