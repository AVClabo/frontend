"use client"

import * as React from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import type { TransitionProps } from "@mui/material/transitions"
import { Box, Stack, Typography, Chip } from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchInput from "../../components/SearchInput"
import { useForm } from "react-hook-form"
import { DemoContainer } from "@mui/x-date-pickers/internals/demo"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select from "@mui/material/Select"
import UploadFileIcon from "@mui/icons-material/UploadFile"
import DeleteIcon from "@mui/icons-material/Delete"
import dayjs from "dayjs"

type FormValues = {
  fullName: string
  gender: string
  phone: string
  referredByDoctor: string
  status: string
  age: string
  address: string
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export default function AddPatientDialog({ patients, setPatients, handleChange }: any) {
  const [open, setOpen] = React.useState(false)
  const [dateOfEntry, setDateOfEntry] = React.useState<any>(dayjs())
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    reset()
    setSelectedFiles([])
    setDateOfEntry(dayjs())
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Convert FileList to array and append to selectedFiles
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData()
    formData.append("full_name", data.fullName)
    formData.append("gender", data.gender)
    formData.append("phone", data.phone)
    formData.append("address", data.address)
    formData.append("age", data.age)
    formData.append("referred_by_doctor", data.referredByDoctor)
    formData.append("status", data.status)
    formData.append("date_of_entry", dateOfEntry.format("YYYY-MM-DD"))

    // Append all selected files with the key 'files'
    selectedFiles.forEach((file) => {
      formData.append("files", file)
    })

   try {
  const token = localStorage.getItem("access_token");

  const res = await fetch("http://localhost:8000/api/patients/", {
    method: "POST",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Add Authorization header
    },
    body: formData,
  });

  if (res.ok) {
    const newPatient = await res.json();
    setPatients((prev: any[]) => [...prev, newPatient]);
    handleClose();
    console.log("Patient created successfully:", newPatient);
  } else {
    const errorText = await res.text(); // Catch error text or HTML
    console.error("Server error:", errorText);
    alert(`Server Error: ${errorText}`);
  }
    } catch (err) {
      console.error("Upload failed", err);
      alert(`Upload failed: ${err}`);
    }

  }

  return (
    <div>
      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <SearchInput handleChange={handleChange} />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={handleClickOpen}>
          Add Patient
        </Button>
      </Stack>

      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="xs"
        fullWidth
        sx={{ height: "100%" }}
      >
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <DialogTitle>Add Patient</DialogTitle>

          <DialogContent dividers>
            <TextField
              margin="dense"
              id="fullName"
              label="Full Name"
              fullWidth
              variant="outlined"
              {...register("fullName", { required: "Name is required" })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="gender-label">Gender</InputLabel>
              <Select
                labelId="gender-label"
                id="gender"
                label="Gender"
                defaultValue=""
                {...register("gender", { required: "Gender is required" })}
                error={!!errors.gender}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            <TextField
              margin="dense"
              id="phone"
              label="Phone no"
              fullWidth
              variant="outlined"
              placeholder="0 123456789"
              {...register("phone", { required: "Phone no is required" })}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              margin="dense"
              id="address"
              label="Address"
              fullWidth
              variant="outlined"
              placeholder="ex: street name, number, postal code"
              {...register("address", { required: "Address is required" })}
              error={!!errors.address}
              helperText={errors.address?.message}
            />

            <TextField
              margin="dense"
              id="age"
              label="Age"
              fullWidth
              variant="outlined"
              placeholder="ex: 18"
              type="number"
              {...register("age", { required: "Age is required" })}
              error={!!errors.age}
              helperText={errors.age?.message}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label="Date of Entry"
                  sx={{ width: "100%" }}
                  value={dateOfEntry}
                  onChange={(newValue) => setDateOfEntry(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

            <TextField
              margin="dense"
              id="referredByDoctor"
              label="Referred By Doctor"
              fullWidth
              variant="outlined"
              placeholder="ex: Dr. Smith"
              {...register("referredByDoctor", { required: "Specialist is required" })}
              error={!!errors.referredByDoctor}
              helperText={errors.referredByDoctor?.message}
            />

            <FormControl fullWidth margin="dense">
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label="Status"
                defaultValue=""
                {...register("status", { required: "Status is required" })}
                error={!!errors.status}
              >
                <MenuItem value="In Treatment">In Treatment</MenuItem>
                <MenuItem value="In ICU">In ICU</MenuItem>
                <MenuItem value="Recovered">Recovered</MenuItem>
                <MenuItem value="Discharged">Discharged</MenuItem>
              </Select>
            </FormControl>

            {/* Multiple File Upload Field */}
            <Box mt={3}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Upload Patient Files
              </Typography>

              <Button
                variant="outlined"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{ justifyContent: "flex-start", textTransform: "none" }}
              >
                Select Files
                <input
                    type="file"
                    hidden
                    multiple
                    onChange={handleFileChange}
                    accept=".dcm,image/*,application/pdf"
                    ref={(ref) => {
                      if (ref) {
                        (ref as any).webkitdirectory = true;
                      }
                    }}
                  />
              </Button>

              {selectedFiles.length > 0 && (
                <Box mt={2} sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {selectedFiles.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      onDelete={() => removeFile(index)}
                      deleteIcon={<DeleteIcon />}
                      sx={{ marginBottom: 1 }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  )
}
