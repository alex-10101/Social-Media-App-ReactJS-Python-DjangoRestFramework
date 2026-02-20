// import { useState, useEffect } from "react";

// /**
//  * Custom hook to fetch an image from the server
//  * @param imgPath
//  * @returns
//  */
// function useGetImage(imgPath: string) {
//   const [imgSrc, setImgSrc] = useState("");
//   const [imgIsLoading, setImgIsLoading] = useState(true);

//   /**
//    * Retrieve an image from the server as blob.
//    * This image will be shown with the post.
//    */
//   useEffect(() => {
//     async function fetchImageAsBlob(imgPath: string) {
//       if (!imgPath || imgPath === "") {
//         // If a post does not contain any image, or if the user does not have any profile picture or cover picture,
//         // set the imgIsLoading state to false.
//         // Otherwise the imgIsLoading state will remain true and a loading spinner will be shown
//         // instead of the post / the user profile.
//         setImgIsLoading(false);
//         return;
//       }

//       try {
//         setImgSrc("");

//         const response = await fetch("http://localhost:8000" + imgPath, {
//           credentials: "include",
//         });

//         if (!ignore) {
//           setImgSrc(URL.createObjectURL(await response.blob()));
//           URL.revokeObjectURL(imgSrc);
//         }
//       } finally {
//         setImgIsLoading(false);
//       }
//     }

//     let ignore = false;
//     fetchImageAsBlob(imgPath);
//     return () => {
//       ignore = true;
//     };
//   }, []);

//   return { imgSrc, imgIsLoading };
// }

// export default useGetImage;
