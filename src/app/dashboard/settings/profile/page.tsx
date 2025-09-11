"use client";
import { PageTitle } from "@/common/components/generic/PageTitle/PageTitle";
import { PageLayout } from "@/common/layouts/PageLayout/PageLayout";
import { useDropzone } from "react-dropzone";
import {
  useGetProfile,
  useUpdateProfile,
  useUploadAvatar,
  useUploadBanner,
} from "./useProfile";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Profile = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { mutate: updateProfile, isSuccess } = useUpdateProfile();
  const onSubmit = (data: any) => updateProfile(data);

  const { refetch, data, isLoading } = useGetProfile();
  const { mutate: uploadAvatar, isSuccess: isSuccessAvatar } =
    useUploadAvatar();
  const { mutate: uploadBanner, isSuccess: isSuccessBanner } =
    useUploadBanner();
  const {
    getInputProps: getInputPropsAvatar,
    getRootProps: getRootPropsAvatar,
  } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      console.log("acceptedFiles", acceptedFiles[0]);
      const formData = new FormData();
      formData.append("avatar", acceptedFiles[0]);
      uploadAvatar(formData);
    },
  });

  const {
    getInputProps: getInputPropsBanner,
    getRootProps: getRootPropsBanner,
  } = useDropzone({
    multiple: false,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      console.log("acceptedFiles", acceptedFiles[0]);
      const formData = new FormData();
      formData.append("banner", acceptedFiles[0]);
      uploadBanner(formData);
    },
  });
  useEffect(() => {
    refetch();
  }, [isSuccessAvatar, isSuccessBanner]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Updated profile ", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [isSuccess]);

  return (
    <PageLayout>
      <PageTitle>{data?.data.getArtist.name}</PageTitle>
      <section>
        <form
          style={{
            position: "relative",
            display: "grid",
            gridTemplateRows: "300px 1fr",
          }}
        >
          <figure
            style={{
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              position: "relative",
              backgroundImage: data?.data.getArtist.banner
                ? `url(${data?.data.getArtist.banner})`
                : "url(https://assets.ghost.io/admin/1585/assets/img/user-cover-e8f42b12b5fcba292a8b5dfa81e13dd2.png)",
            }}
          >
            <div
              style={{
                display: "grid",
                alignItems: "center",
                justifyItems: "center",
                margin: "16px 16px",
                padding: "8px 16px",
                backgroundColor: "rgba(0,0,0,0.5)",
                color: "white",
                position: "absolute",
                borderRadius: "4px",
                cursor: "pointer",
              }}
              {...getRootPropsBanner({ className: "dropzone" })}
            >
              <input {...getInputPropsBanner()} />
              Change cover
            </div>
          </figure>
          <figure className="w-[150px] h-[150px] absolute top-[236px] left-0 right-0 text-center my-0 mx-auto">
            <div
              className={`bg-cover bg-center rounded-full bg-white w-full h-full`}
              style={{
                backgroundImage: data?.data.getArtist.avatar
                  ? `url(${data?.data.getArtist.avatar})`
                  : "url(https://assets.ghost.io/admin/1585/assets/img/user-image-639a88b784fb5f10964be8b975ca9fdf.png)",
              }}
            ></div>
            <div className="flex gap-2">

              <div
                style={{
                  display: "grid",
                  alignItems: "center",
                  justifyItems: "center",
                  padding: "8px 16px",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  color: "white",
                  borderRadius: "4px",
                  marginTop: "8px",
                  cursor: "pointer",

                }}
                {...getRootPropsAvatar({ className: "dropzone w-fit" })}
              >
                <input {...getInputPropsAvatar()} />
                Change image
              </div>
            </div>
          </figure>
          <div className="border border-[#e6e9eb] mt-[144px] grid grid-rows-1 rounded-[12px] p-[24px]">
            <div className="mx-auto w-full max-w-[540px] flex items-center justify-between h-[40px] mb-[24px] border-b border-[#37352f1a]">
              <span className="text-[16px] text-[#37352f] font-bold">My profile</span>
              <a
                href="/reset-password"
                className="bg-green-500 shrink-0 text-[13px] font-medium px-3 py-1.5 rounded-md border border-[#dddedf] hover:bg-green-400"
              >
                Change password
              </a>
            </div>
            <fieldset className="max-w-[540px] grid grid-rows-[100px_100px_100px] gap-[16px] my-[16px] mx-auto w-full">
              <div className="grid grid-rows-[16px_48px_16px] items-center">
                <label
                  htmlFor="user-name"
                  className="text-[14px] font-medium text-[#15171a]"
                >
                  Full name
                </label>
                {isLoading ? null : (
                  <input
                    id="user-name"
                    className="h-[40px] p-[6px_12px] border border-[#dddedf] rounded w-full"
                    {...register("name")}
                    defaultValue={data?.data.getArtist.name}
                  />
                )}
                <p className="text-[13px] font-normal text-[#738393]">
                  Use your real name so people can recognize you
                </p>
              </div>

              <div className="grid grid-rows-[16px_48px_16px] items-center">
                <label
                  htmlFor="user-email"
                  className="text-[14px] font-medium text-[#15171a]"
                >
                  Email
                </label>
                {isLoading ? null : (
                  <input
                    id="user-email"
                    className="h-[40px] p-[6px_12px] border border-[#dddedf] rounded w-full"
                    disabled
                    value={data?.data.getArtist.email}
                  />
                )}
                <p className="text-[13px] font-normal text-[#738393]">
                  Used for notifications
                </p>
              </div>

              <div className="grid grid-rows-[16px_1fr_16px] items-center">
                <label
                  htmlFor="user-bio"
                  className="text-[14px] font-medium text-[#15171a]"
                >
                  Bio
                </label>
                <textarea
                  id="user-bio"
                  className="max-h-[100px] min-h-[60px] h-full p-[6px_12px] border border-[#dddedf] rounded w-full"
                  {...register("bio")}
                  defaultValue={data?.data.getArtist.bio}
                />
                <p className="text-[13px] font-normal text-[#738393]">
                  Recommended: 200 characters
                </p>
              </div>
            </fieldset>

            <div className="border-b border-gray-200 text-lg text-gray-700 mb-[24px] mt-[48px] h-[40px] mx-auto w-full max-w-[540px] font-bold">
              My social media
            </div>
            <fieldset
              className="max-w-[540px] grid grid-rows-[100px_100px_100px] gap-[16px] my-[16px] mx-auto w-full"
            // style={{
            //   maxWidth: "540px",
            //   display: "grid",
            //   gridTemplateRows: "100px 100px 100px",
            //   gap: "16px",
            //   margin: "16px auto",
            //   width: "100%",
            // }}
            >
              <div className="grid grid-rows-3 gap-2 items-center">
                <label
                  htmlFor="user-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Instagram
                </label>
                {isLoading ? null : (
                  <input
                    id="user-name"
                    className="h-10 px-3 border border-gray-300 rounded w-full"
                    {...register("instagram")}
                    defaultValue={data?.data.getArtist.instagram}
                  />
                )}
                <p className="text-xs font-normal text-gray-500">
                  URL of your personal Instagram
                </p>
              </div>

              <div className="grid grid-rows-3 gap-2 items-center">
                <label
                  htmlFor="user-name"
                  className="text-sm font-medium text-gray-700"
                >
                  Facebook
                </label>
                {isLoading ? null : (
                  <input
                    id="user-name"
                    className="h-10 px-3 border border-gray-300 rounded w-full"
                    {...register("facebook")}
                    defaultValue={data?.data.getArtist.facebook}
                  />
                )}
                <p className="text-xs font-normal text-gray-500">
                  URL of your personal Facebook
                </p>
              </div>

              <div className="grid grid-rows-3 gap-2 items-center">
                <label
                  htmlFor="user-name"
                  className="text-sm font-medium text-gray-700"
                >
                  X (twitter)
                </label>
                {isLoading ? null : (
                  <input
                    id="user-name"
                    className="h-10 px-3 border border-gray-300 rounded w-full"
                    {...register("twitter")}
                    defaultValue={data?.data.getArtist.twitter}
                  />
                )}
                <p className="text-xs font-normal text-gray-500">
                  URL of your personal X
                </p>
              </div>
            </fieldset>
          </div>
        </form>
        <form></form>
      </section>
      <div
        className="grid items-center justify-items-center w-[88px] h-[40px] fixed bottom-[24px] right-[64px] bg-black rounded-md text-white text-lg cursor-pointer"
        onClick={handleSubmit(onSubmit)}
      >
        Save
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </PageLayout>
  );
};
export default Profile;