import {
  Box,
  Button,
  Checkbox,
  Input,
  Stack,
  Text,
  InputGroup,
  InputRightAddon,
  Icon,
  GridItem,
  Grid,
  FormControl,
  FormLabel,
  FormHelperText,
  useToast,
  Select,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { updateAddress } from "../redux/reducer/authSlice";
import api from "../lib/api"

const AddressFormComponent = () => {
  const [dataProvinsi, setDataProvinsi] = useState([])
  const [dataKota, setDataKota] = useState([])
  const [selectedProvinsi, setSelectedProvinsi] = useState()
  const [kodepos, setKodePos] = useState()
  const [checkoutId, setChekoutId] = useState()
  const router = useRouter()
  const toast = useToast()
  const { id } = router.query
  const dispatch = useDispatch()


  const formik = useFormik({
    initialValues: {
      labelAlamat: "",
      namaDepan: "",
      namaBelakang: "",
      nomorHp: "",
      provinsi: "",
      kotaKabupaten: "",
      kecamatan: "",
      alamat: "",
      kodePos: "",
      nama: "",
      province_id: 0,
      city_id: 0,
      main_address: false
    },

    validationSchema: Yup.object().shape({
      labelAlamat: Yup.string().required("This field is required"),
      namaDepan: Yup.string().required("This field is required"),
      namaBelakang: Yup.string().required("This field is required"),
      nomorHp: Yup.string().required("This field is required"),
      provinsi: Yup.string().required("This field is required"),
      kotaKabupaten: Yup.string().required("This field is required"),
      kecamatan: Yup.string().required("This field is required"),
      alamat: Yup.string().required("This field is required"),
    }),
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        const res = await api.post("/profile/tambahAl", values)
        dispatch(updateAddress(res.data.result))

        if (res.data.message !== undefined) {
          toast({
            status: "success",
            title: "Add new Address success",
            description: res.data.message || "add New Address success",
            isClosable: true,
            duration: 9000,
            position: "top-right"
          })
        }
        if (!checkoutId) {
          window.history.back()
        }
        router.push({ pathname: "/checkout", query: { id: checkoutId } })
      } catch (err) {
        toast({
          status: "error",
          title: "error add new Address",
          description: err?.response?.data?.message || err?.message,
          duration: 9000,
          isClosable: true,
          position: "top-right"
        })
      }
    },
  });

  const mainAddresHandler = (event) => {
    formik.setFieldValue("main_address", event.target.checked)
  }


  const provinsi = async () => {
    try {
      const res = await api.get("/api/provinsi")
      const data = res?.data?.rajaongkir.results
      setDataProvinsi(data)

    } catch (err) {
      toast({
        status: "error",
        title: "error",
        description: err?.response?.data?.message || err?.message,
        duration: 5000,
        isClosable: true
      })

    }
  }

  const kota = async (provinsiId) => {
    try {
      const res = await api.get(`/api/kota/${provinsiId}`)
      const data = res.data.rajaongkir.results
      setDataKota(data)
    } catch (err) {
      toast({
        status: "error",
        title: "error",
        description: err?.response?.data?.message || err?.message,
        duration: 5000,
        isClosable: true
      })
    }
  }

  const provinsiHandler = async (e) => {
    const parsedValue = JSON.parse(e.target.value)
    formik.setFieldValue("provinsi", parsedValue.province)
    formik.setFieldValue("province_id", parsedValue.province_id)
    setSelectedProvinsi(parsedValue.province_id)
    kota(parsedValue.province_id)
  }
  const kotaHandler = async (e) => {
    const parsedValue = JSON.parse(e.target.value)
    formik.setFieldValue("kotaKabupaten", parsedValue.city_name)
    formik.setFieldValue("city_id", parsedValue.city_id)
    formik.setFieldValue("kodePos", parsedValue.postal_code)
    setKodePos(parsedValue.postal_code)
  }
  useEffect(() => {
    provinsi()
    setChekoutId(id)

  }, [])

  return (
    <Box
      display={["block", "block", "block"]}
      mx="auto"
      w={["90%", "60%"]}
      mb={["50px", "50px", "100px"]}
      justifyContent="center"
    >
      <Text mb="68px" variant="title">
        Alamat Pengiriman
      </Text>
      <FormControl isInvalid={formik.errors.labelAlamat}>
        <FormLabel>
          <Text mb="16px" variant="mini-title">
            Label Alamat
          </Text>
        </FormLabel>
        <Input
          onChange={(event) =>
            formik.setFieldValue("labelAlamat", event.target.value)
          }
        />
        <FormHelperText>{formik.errors.labelAlamat}</FormHelperText>
      </FormControl>
      <Text mt="52px" mb="36px" variant="mini-title">
        Info Penerima
      </Text>
      <Grid
        templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]}
        gap={[0, 4, 4]}
      >
        <GridItem colSpan={[1, 1, 1]} mb="36px">
          <Text mb="16px" variant="caption">
            Nama Depan
          </Text>
          <Input
            onChange={event => formik.setFieldValue("namaDepan", event.target.value)}
          />
        </GridItem>
        <GridItem colSpan={[1, 1, 1]}>
          <FormControl isInvalid={formik.errors.namaBelakang}>
            <FormLabel>
              <Text mb="16px" variant="caption">
                Nama Belakang
              </Text>
            </FormLabel>
            <Input
              onChange={event => formik.setFieldValue("namaBelakang", event.target.value)}
            />
            <FormHelperText>{formik.errors.namaBelakang}</FormHelperText>
          </FormControl>
        </GridItem>
      </Grid>
      <FormControl isInvalid={formik.errors.nomorHp}>
        <FormLabel>
          <Text mb="16px" variant="caption">
            Nomor Hp
          </Text>
        </FormLabel>
        <InputGroup>
          <Input
            mb="36px"
            type="number"
            onChange={(event) =>
              formik.setFieldValue("nomorHp", event.target.value)
            }
          />
        </InputGroup>
        <FormHelperText>{formik.errors.nomorHp}</FormHelperText>
      </FormControl>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={[2, 1, 1]} mb="36px">
          <FormControl isInvalid={formik.errors.provinsi}>
            <FormLabel>
              <Text mb="16px" variant="caption">
                Provinsi
              </Text>
            </FormLabel>
            <InputGroup>
              <Select onChange={provinsiHandler}>
                <option>silahkan pilih provinsi</option>
                {dataProvinsi.length !== 0 && dataProvinsi.map((val) => {
                  return (
                    <option key={val.province_id} value={JSON.stringify(val)}>{val.province}</option>
                  )
                })
                }
              </Select>
            </InputGroup>
            <FormHelperText>{formik.errors.provinsi}</FormHelperText>
          </FormControl>
        </GridItem>
        <GridItem colSpan={[2, 1, 1]}>
          <FormControl isInvalid={formik.errors.kotaKabupaten}>
            <FormLabel>
              <Text mb="16px" variant="caption">
                Kota/Kabupaten
              </Text>
            </FormLabel>
            <InputGroup>
              <Select type="text" onChange={kotaHandler} placeholder="silahkan pilih Kota/Kabupaten" >
                {selectedProvinsi && dataKota && dataKota.map((val) => {
                  return (
                    <option key={val.city_id} value={JSON.stringify(val)}>{val.city_name}</option>
                  )
                })
                }
              </Select>
            </InputGroup>
            <FormHelperText>{formik.errors.kotaKabupaten}</FormHelperText>
          </FormControl>
        </GridItem>
      </Grid>
      <FormControl isInvalid={formik.errors.kecamatan}>
        <FormLabel>
          <Text mb="16px" variant="caption">
            Kecamatan
          </Text>
        </FormLabel>
        <InputGroup w="245.59px">
          <Input
            mb="36px"
            onChange={(event) =>
              formik.setFieldValue("kecamatan", event.target.value)
            }
          />
        </InputGroup>
        <FormHelperText>{formik.errors.kecamatan}</FormHelperText>
      </FormControl>
      <FormControl isInvalid={formik.errors.alamat}>
        <FormLabel>
          <Text mb="16px" variant="caption">
            Alamat
          </Text>
        </FormLabel>
        <Input
          mb="36px"
          onChange={(event) =>
            formik.setFieldValue("alamat", event.target.value)
          }
        />
        <FormHelperText>{formik.errors.alamat}</FormHelperText>
      </FormControl>
      <FormControl isInvalid={formik.errors.kodePos}>
        <FormLabel>
          <Text mb="16px" variant="caption">
            Kode Pos
          </Text>
        </FormLabel>
        <InputGroup w="245.59px">
          <Input
            mb="36px"
            defaultValue={kodepos}
            value={kodepos}
            disabled
          />
          <InputRightAddon bg="white">
            <Icon as={IoIosArrowDown} />
          </InputRightAddon>
        </InputGroup>
        <FormHelperText>{formik.errors.kodePos}</FormHelperText>
      </FormControl>
      <Stack>
        <Checkbox
          onChange={mainAddresHandler}
          mb="50px"
        >
          <Text variant="caption">Simpan sebagai alamat utama</Text>
        </Checkbox>
        <Stack direction="row" justifyContent="space-between">
          <Button variant="main-outline" w="300px">
            <Text>Batalkan</Text>
          </Button>
          <Button
            isDisabled={
              !(
                formik.values.alamat &&
                formik.values.kecamatan &&
                formik.values.kotaKabupaten &&
                formik.values.labelAlamat &&
                formik.values.namaBelakang &&
                formik.values.namaDepan &&
                formik.values.nomorHp &&
                formik.values.provinsi
              )
            }
            _hover={{
              bgColor: "#006D7F",
              color: "#FFFFF0",
            }}
            variant="main"
            w="300px"
            onClick={formik.handleSubmit}
          >
            Simpan Alamat
          </Button>
        </Stack>
      </Stack>
    </Box >
  );
};
export default AddressFormComponent;
