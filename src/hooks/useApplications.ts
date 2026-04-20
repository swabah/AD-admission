import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getAllApplications,
	addApplication,
	updateApplicationStatus,
	deleteApplication,
} from "../services/supabase";

export const useApplications = () => {
	const queryClient = useQueryClient();

	const { data: applications, isLoading } = useQuery({
		queryKey: ["applications"],
		queryFn: getAllApplications,
	});

	const createMutation = useMutation({
		mutationFn: addApplication,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, status }: { id: string; status: string }) =>
			updateApplicationStatus(id, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
		},
	});

	const deleteMutation = useMutation({
		mutationFn: deleteApplication,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["applications"] });
		},
	});

	return {
		applications,
		isLoading,
		createApplication: createMutation.mutateAsync,
		updateApplication: updateMutation.mutateAsync,
		deleteApplication: deleteMutation.mutateAsync,
		isCreating: createMutation.isPending,
		isUpdating: updateMutation.isPending,
		isDeleting: deleteMutation.isPending,
	};
};
