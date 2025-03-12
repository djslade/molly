package selectors

import "slices"

var hostsWithoutSubsteps = []string{
	"www.pinchofyum.com",
	"pinchofyum.com",
}

/*
Some recipe site authors add a lot of colourful language to their recipe
instructions. In these cases, recording substeps isn't a good idea.
*/
func SetNoSubsteps(host string) bool {
	return slices.Contains(hostsWithoutSubsteps, host)
}
